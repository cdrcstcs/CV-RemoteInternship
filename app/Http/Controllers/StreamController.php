<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import the Log facade
use App\Models\Stream;
use App\Models\Block;
use App\Models\User;
use App\Models\Follow;
use Agence104\LiveKit\RoomServiceClient;
use Agence104\LiveKit\IngressServiceClient;
use App\Integrations\files\CloudinaryImageClient; // Use the custom Cloudinary client


class StreamController extends Controller
{
    protected $cloudinaryClient;
    protected $roomService;
    protected $ingressServiceClient; // Changed to IngressServiceClient

    public function __construct()
    {
        $this->roomService = new RoomServiceClient(
            env('LIVEKIT_URL'),
            env('LIVEKIT_API_KEY'),
            env('LIVEKIT_API_SECRET')
        );
        $this->cloudinaryClient = new CloudinaryImageClient();

        $this->ingressServiceClient = new IngressServiceClient(env('LIVEKIT_URL'),env('LIVEKIT_API_KEY'),env('LIVEKIT_API_SECRET')); // Updated to IngressServiceClient
    }

    public function createStream(Request $request)
    {
        $self = $request->user(); // Get the authenticated user
        Log::info("User {$self->id} is attempting to create a new stream");

        // Check if the user already has an active stream
        $existingStream = Stream::where('user_id', $self->id)->where('isLive', true)->first();
        if ($existingStream) {
            Log::warning("User {$self->id} already has an active stream.");
            return response()->json(['message' => 'You already have an active stream.'], 400);
        }

        // Validate the request input for title, thumbnail (file upload), and chat settings
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',  // Ensure the thumbnail is a valid image and limit file size
                'isChatEnabled' => 'nullable|string|in:true,false', // Validate as a string with 'true' or 'false'
                'isChatDelayed' => 'nullable|string|in:true,false', // Validate as a string with 'true' or 'false'
                'isChatFollowersOnly' => 'nullable|string|in:true,false', // Validate as a string with 'true' or 'false'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Validation failed for user {$self->id}. Errors: " . json_encode($e->errors()));
            return response()->json(['message' => 'Invalid input data'], 422);
        }

        $title = $validatedData['title'];

        // Handle the thumbnail upload if present
        $thumbnailPath = 'default-thumbnail.jpg';  // Default thumbnail if no file is uploaded
        if ($request->hasFile('thumbnail')) {
            $uploadedFile = $request->file('thumbnail'); // Get the uploaded file

            // Get MIME type and content of the uploaded file
            $mimeType = $uploadedFile->getClientMimeType();
            $base64Contents = base64_encode($uploadedFile->get());

            try {
                // Upload image using custom Cloudinary client (ensure $this->cloudinaryClient is configured properly)
                $uploadResult = $this->cloudinaryClient->uploadImage($mimeType, $base64Contents);

                // If the upload is successful, we get the secure URL
                if ($uploadResult->isSuccess) {
                    $thumbnailPath = $uploadResult->secureUrl; // Use the Cloudinary URL
                    Log::info('Product image uploaded to Cloudinary', ['image_url' => $thumbnailPath]);
                } else {
                    throw new \Exception("Cloudinary image upload failed: " . $uploadResult->msg);
                }
            } catch (\Exception $e) {
                Log::error('Error uploading image to Cloudinary for user ' . $self->id . ': ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                return response()->json(['message' => 'Failed to upload thumbnail image'], 500);
            }
        }

        // Create a new ingress for the stream
        $inputType = 1;  // Set to the correct input type (replace 0 with the appropriate value)
        $name = $self->first_name . ' ' . $self->last_name;
        $roomName = $self->id;  // The room name will be the user ID (this could be customized)
        $participantName = $self->first_name . ' ' . $self->last_name;
        $participantIdentity = $self->id;
        $bypassTranscoding = true;

        // Create the ingress using the updated IngressServiceClient
        try {
            $ingress = $this->ingressServiceClient->createIngress(
                $inputType,
                $name,
                $roomName,
                $participantIdentity,
                $participantName,
                null,
                null,
                $bypassTranscoding,
            );
        } catch (\Exception $e) {
            Log::error("Failed to create ingress for user {$self->id}: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Failed to create stream ingress.'], 500);
        }

        // Check if ingress was successfully created
        if (!$ingress || !$ingress->getUrl() || !$ingress->getStreamKey()) {
            Log::error("Ingress creation failed for user {$self->id}. Ingress data: " . json_encode($ingress));
            return response()->json(['message' => 'Failed to create ingress'], 500);
        }


        // Extract chat settings from the validated data and convert them to boolean
        $isChatEnabled = filter_var($validatedData['isChatEnabled'] ?? 'true', FILTER_VALIDATE_BOOLEAN); // Default to true if not provided
        $isChatDelayed = filter_var($validatedData['isChatDelayed'] ?? 'false', FILTER_VALIDATE_BOOLEAN); // Default to false if not provided
        $isChatFollowersOnly = filter_var($validatedData['isChatFollowersOnly'] ?? 'false', FILTER_VALIDATE_BOOLEAN); // Default to false if not provided

        // Store the stream information in the database
        try {
            $stream = Stream::create([
                'user_id' => $self->id,
                'title' => $title,  // Use the title from the request input
                'thumbnail' => $thumbnailPath,  // Save the Cloudinary URL or default
                'ingressId' => $ingress->getIngressId(),  // Use the getter method for ingressId
                'serverUrl' => $ingress->getUrl(),  // Use the getter method for url
                'streamKey' => $ingress->getStreamKey(),  // Use the getter method for streamKey
                'isLive' => true,
                'isChatEnabled' => $isChatEnabled,
                'isChatDelayed' => $isChatDelayed,
                'isChatFollowersOnly' => $isChatFollowersOnly,
            ]);            
        } catch (\Exception $e) {
            Log::error("Error saving stream data to the database for user {$self->id}: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['message' => 'Failed to save stream data'], 500);
        }

        Log::info("Stream created successfully for user {$self->id}, stream ID: {$stream->id}");

        return response()->json($stream);
    }


    // Stop the stream (mark as not live)
    public function stopStream(Request $request)
    {
        $self = $request->user(); // Get the authenticated user

        Log::info("User {$self->id} is attempting to stop their stream");

        // Find the active stream for the user
        $stream = Stream::where('user_id', $self->id)->where('isLive', true)->first();

        if (!$stream) {
            Log::warning("User {$self->id} does not have an active stream.");
            return response()->json(['message' => 'No active stream found'], 400);
        }

        // Mark the stream as not live
        $stream->isLive = false;
        $stream->save();

        Log::info("Stream stopped successfully for user {$self->id}");

        return response()->json(['message' => 'Stream stopped successfully']);
    }

    // Method to search streams based on a term
    public function searchStreams(Request $request)
    {
        try {
            $term = $request->input('term', ''); // Get search term, default to empty string
            $userId = $request->user()->id; // Get authenticated user's ID

            Log::info("User {$userId} is searching streams with term: '{$term}'.");

            // Initialize query
            $query = Stream::query();

            if ($userId) {
                // If the user is authenticated, exclude their own streams
                $query->where('user_id', '!=', $userId);
            }

            // Apply search filters
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', '%' . $term . '%')
                  ->orWhereHas('user', function ($q) use ($term) {
                      $q->where('first_name', 'like', '%' . $term . '%')
                        ->orWhere('last_name', 'like', '%' . $term . '%');
                  });
            });

            // Apply ordering by isLive status (desc) and updatedAt timestamp (desc)
            $streams = $query->with(['user' => function ($query) {
                    $query->select('id', 'first_name', 'last_name'); // Include user details
                }])
                ->orderBy('is_live', 'desc')
                ->orderBy('updated_at', 'desc')
                ->get([
                    'id',
                    'user_id',
                    'title',
                    'is_live',
                    'thumbnail',
                    'updated_at',
                ]);

            Log::info("Stream search completed for user {$userId}, found " . count($streams) . " results.");

            return response()->json($streams);
        } catch (\Exception $e) {
            Log::error("An error occurred during stream search: {$e->getMessage()}");
            return response()->json(['message' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }

    // Method to get recommended users
    public function getRecommendedUsers(Request $request)
    {
        try {
            $self = $request->user();
            $userId = $self ? $self->id : null;

            Log::info("User {$userId} is requesting recommended users.");

            // Initialize users array
            $users = [];

            if ($userId) {
                // Get all users except the authenticated one
                $users = User::where('id', '!=', $userId)
                    ->with(['stream' => function ($query) {
                        $query->select('isLive');
                    }])
                    ->orderBy('created_at', 'desc')
                    ->get();

                // Get the ids of the users the authenticated user is following
                $followingIds = Follow::where('follower_id', $userId)
                    ->pluck('following_id')
                    ->toArray();

                // Get the ids of the users that have blocked the authenticated user
                $blockedIds = Block::where('blocker_id', $userId)
                    ->pluck('blocked_id')
                    ->toArray();

                // Filter out users that are followed or blocked by the authenticated user
                $users = $users->filter(function ($user) use ($followingIds, $blockedIds) {
                    return !in_array($user->id, $followingIds) && !in_array($user->id, $blockedIds);
                });

                Log::info("Recommended users filtered for user {$userId}, found " . count($users) . " users.");
            } else {
                // If no user is authenticated, return all users
                $users = User::with(['stream' => function ($query) {
                    $query->select('isLive');
                }])
                    ->orderBy('created_at', 'desc')
                    ->get();

                Log::info("No user authenticated, returning all recommended users, found " . count($users) . " users.");
            }

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error("An error occurred while fetching recommended users: {$e->getMessage()}");
            return response()->json(['message' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }

    // Method to fetch streams for the authenticated user or all streams if not authenticated
    public function getStreams(Request $request)
    {
        try {
            $self = $request->user();
            $userId = $self ? $self->id : null;

            Log::info("User {$userId} is requesting streams.");

            // If the user is authenticated, fetch streams excluding the blocked ones
            if ($userId) {
                $streams = Stream::whereDoesntHave('user.blocks', function ($query) use ($userId) {
                    $query->where('blocked_id', $userId);
                })
                ->with(['user'])  // Eager load the user relationship to avoid N+1 issues
                ->orderBy('isLive', 'desc')
                ->orderBy('updated_at', 'desc')
                ->get([
                    'id',
                    'user_id',  // assuming user_id is stored in the streams table
                    'isLive',
                    'title',
                    'thumbnail'
                ]);
                Log::info("Streams fetched for authenticated user {$userId}.");
            } else {
                // If no user is authenticated, fetch all streams
                $streams = Stream::with(['user'])  // Eager load user relationship
                    ->orderBy('isLive', 'desc')
                    ->orderBy('updated_at', 'desc')
                    ->get([
                        'id',
                        'user_id',  // assuming user_id is stored in the streams table
                        'isLive',
                        'title',
                        'thumbnail'
                    ]);
                Log::info("Streams fetched for guest user.");
            }

            return response()->json($streams);
        } catch (\Exception $e) {
            Log::error("An error occurred while fetching streams: {$e->getMessage()}");
            return response()->json(['message' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    // Method to update the stream for the authenticated user
    public function updateStream(Request $request)
    {
        try {
            // Get the authenticated user from the request
            $user = $request->user();

            Log::info("User {$user->id} is attempting to update their stream.");

            // Fetch the stream for the authenticated user
            $selfStream = Stream::where('user_id', $user->id)->first();

            if (!$selfStream) {
                Log::warning("Stream not found for user {$user->id}.");
                return response()->json(['message' => 'Stream not found'], 404);
            }

            // Validate and prepare the data
            $validData = $request->only([
                'thumbnail',
                'title',
                'isChatEnabled',
                'isChatFollowersOnly',
                'isChatDelayed',
            ]);

            // Log the data being updated
            Log::info("User {$user->id} is updating the stream with data: ", $validData);

            // Update the stream in the database
            $updatedStream = $selfStream->update($validData);

            if (!$updatedStream) {
                Log::error("Failed to update the stream for user {$user->id}.");
                return response()->json(['message' => 'Failed to update the stream'], 500);
            }

            Log::info("Stream updated successfully for user {$user->id}.");

            return response()->json(['message' => 'Stream updated successfully', 'stream' => $selfStream]);
        } catch (\Exception $e) {
            // Log the exception error
            Log::error("An error occurred while updating stream for user {$request->user()->id}: {$e->getMessage()}");

            return response()->json(['message' => 'Internal Error'], 500);
        }
    }
}

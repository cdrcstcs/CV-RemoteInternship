<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Agence104\LiveKit\AccessToken;
use Agence104\LiveKit\AccessTokenOptions;

use Agence104\LiveKit\VideoGrant;
use App\Models\Block;

class ViewerController extends Controller
{
    // Method to create a viewer token for the LiveKit room
    public function createViewerToken(Request $request, $hostIdentity)
    {
        try {
            // Log the incoming request for viewer token creation
            Log::info("Received request to create viewer token for hostIdentity: {$hostIdentity}");

            // Get the authenticated user or create a guest user if not authenticated
            $self = $request->user();

            // Log whether the user is authenticated or a guest
            if (!$self) {
                Log::info("No authenticated user found. Creating a guest user.");
                $self = (object)[
                    'id' => (string) \Str::uuid(),  // Generate a new UUID for guest
                    'first_name' => 'Guest',  // Random guest first name
                    'last_name' => rand(100000, 999999),  // Random guest last name
                ];
                Log::info("Guest user created with ID {$self->id}");
            } else {
                Log::info("Authenticated user: {$self->first_name} {$self->last_name} with ID {$self->id}.");
            }

            // Log the attempt to find the host user
            Log::info("Attempting to find the host user with ID {$hostIdentity}");

            // Find the host user by their identity (id)
            $host = User::where('id', $hostIdentity)->first();

            if (!$host) {
                Log::warning("Host with ID {$hostIdentity} not found.");
                return response()->json(['error' => 'Host not found'], 404);
            }

            Log::info("Found host with ID {$host->id} and name {$host->first_name} {$host->last_name}");

            // Check if the authenticated user is blocked by the host
            Log::info("Checking if user {$self->id} is blocked by host {$host->id}");
            if ($this->isBlockedByUser($host->id, $self->id)) {
                Log::warning("User {$self->id} is blocked by host {$host->id}.");
                return response()->json(['error' => 'User is blocked'], 403);
            }

            Log::info("User {$self->id} is not blocked by host {$host->id}");

            // Determine if the user is the host
            $isHost = $self->id === $host->id;
            Log::info("User {$self->id} is " . ($isHost ? "the host" : "a viewer"));

            // Log the LiveKit token creation
            Log::info("Creating LiveKit AccessToken for user {$self->id}");

            // Create the LiveKit AccessToken
            $tokenOptions = new AccessTokenOptions();
            $tokenOptions->setIdentity($isHost ? 'Host-' . $self->id : $self->id);
            $tokenOptions->setName($self->first_name . ' ' . $self->last_name);

            // Create the LiveKit AccessToken with the token options
            $token = new AccessToken(env('LIVEKIT_API_KEY'), env('LIVEKIT_API_SECRET'));
            $token->init($tokenOptions);

            if ($token) {
                Log::info("AccessToken successfully created for user {$self->id}");
            } else {
                Log::error("Failed to create AccessToken for user {$self->id}");
                return response()->json(['error' => 'Failed to create AccessToken'], 500);
            }

            // Add the VideoGrant to the token
            Log::info("Creating VideoGrant for user {$self->id} for room {$host->id}");
            $videoGrant = new VideoGrant();
            $videoGrant->setRoomJoin()
                       ->setRoomName($host->id)
                       ->setCanPublish(false)  // Viewer cannot publish
                       ->setCanPublishData(true);

            // Log the state of the video grant before adding it
            Log::info("VideoGrant details: " . json_encode($videoGrant->getData()));

            // Check if the AccessToken class has a method to accept grants
            if (method_exists($token, 'setGrant')) {
                Log::info("Adding VideoGrant to AccessToken.");
                $token->setGrant($videoGrant);  // Add the VideoGrant to the token
                Log::info("VideoGrant successfully added to AccessToken.");
            } else {
                Log::error("Failed to add VideoGrant: setGrant method does not exist on AccessToken.");
                return response()->json(['error' => 'Failed to add VideoGrant'], 500);
            }

            // Log the final token before returning
            Log::info("Generated viewer token for user {$self->id} for room {$host->id}. Token: " . $token->toJwt());

            // Return the JWT token
            return response()->json($token->toJwt());
        } catch (\Exception $e) {
            // Log the exception with the detailed error message and stack trace
            Log::error("Error creating viewer token for host {$hostIdentity}: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }

    // Method to check if the user is blocked by another user
    private function isBlockedByUser($userId, $selfId)
    {
        try {
            // Log the block status check attempt
            Log::info("Checking block status: Is user {$selfId} blocked by {$userId}?");

            // Check if the self user is blocked by the specified user
            $isBlocked = Block::where('blocker_id', $userId)
                        ->where('blocked_id', $selfId)
                        ->exists();

            // Log whether the user is blocked
            if ($isBlocked) {
                Log::info("User {$selfId} is blocked by {$userId}.");
            } else {
                Log::info("User {$selfId} is not blocked by {$userId}.");
            }

            return $isBlocked;
        } catch (\Exception $e) {
            // Log the error in checking block status
            Log::error("Error checking block status: " . $e->getMessage(), ['exception' => $e]);
            return false;
        }
    }
}

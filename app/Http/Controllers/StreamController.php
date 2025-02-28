<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stream;
use Illuminate\Support\Facades\Log; // Import the Log facade

class StreamController extends Controller
{
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
                return response()->json(['error' => 'Stream not found'], 404);
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
                return response()->json(['error' => 'Failed to update the stream'], 500);
            }

            Log::info("Stream updated successfully for user {$user->id}.");

            return response()->json(['message' => 'Stream updated successfully', 'stream' => $selfStream]);
        } catch (\Exception $e) {
            // Log the exception error
            Log::error("An error occurred while updating stream for user {$request->user()->id}: {$e->getMessage()}");

            return response()->json(['error' => 'Internal Error'], 500);
        }
    }
}

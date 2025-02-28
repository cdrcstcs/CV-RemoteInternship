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
            // Get the authenticated user or create a guest user if not authenticated
            $self = $request->user();

            if (!$self) {
                $self = (object)[
                    'id' => (string) \Str::uuid(),  // Generate a new UUID for guest
                    'first_name' => 'Guest',  // Random guest first name
                    'last_name' => rand(100000, 999999),  // Random guest last name
                ];
                Log::info("Guest user created with ID {$self->id}");
            } else {
                Log::info("Authenticated user {$self->first_name} {$self->last_name} with ID {$self->id} requested viewer token.");
            }

            // Find the host user by their identity (id)
            $host = User::where('id', $hostIdentity)->first();
            if (!$host) {
                Log::warning("Host with ID {$hostIdentity} not found.");
                return response()->json(['error' => 'Host not found'], 404);
            }

            // Check if the authenticated user is blocked by the host
            if ($this->isBlockedByUser($host->id, $self->id)) {
                Log::warning("User {$self->id} is blocked by host {$host->id}.");
                return response()->json(['error' => 'User is blocked'], 403);
            }

            // Determine if the user is the host
            $isHost = $self->id === $host->id;

            // Create the LiveKit AccessToken
            $token = new AccessToken(
                env('LIVEKIT_API_KEY'),
                env('LIVEKIT_API_SECRET'),
                [
                    'identity' => $isHost ? 'Host-' . $self->id : $self->id,
                    'name' => $self->first_name . ' ' . $self->last_name,
                ]
            );

            // Add grants to the token
            $token->addGrant(
                (new VideoGrant())
                    ->setRoomJoin()
                    ->setRoomName($host->id)
                    ->setCanPublish(false)  // Viewer cannot publish
                    ->setCanPublishData(true)
            );

            Log::info("Viewer token created for user {$self->id} for room {$host->id}.");

            // Return the JWT token
            return response()->json(['token' => $token->toJwt()]);
        } catch (\Exception $e) {
            Log::error("Error creating viewer token: " . $e->getMessage());
            return response()->json(['error' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }

    // Method to check if the user is blocked by another user
    private function isBlockedByUser($userId, $selfId)
    {
        try {
            // Check if the self user is blocked by the specified user
            $isBlocked = Block::where('blocker_id', $userId)
                        ->where('blocked_id', $selfId)
                        ->exists();

            if ($isBlocked) {
                Log::info("User {$selfId} is blocked by {$userId}.");
            }

            return $isBlocked;
        } catch (\Exception $e) {
            Log::error("Error checking block status: " . $e->getMessage());
            return false;
        }
    }
}

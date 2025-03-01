<?php

namespace App\Http\Controllers;

use Agence104\LiveKit\RoomServiceClient;
use Agence104\LiveKit\AccessToken;
use Agence104\LiveKit\AccessTokenOptions;
use Agence104\LiveKit\VideoGrant;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Block;
use Illuminate\Support\Facades\Log; // Import the Log facade

class BlockController extends Controller
{
    private $roomService;

    public function __construct()
    {
        $this->roomService = new RoomServiceClient(
            env('LIVEKIT_URL'),
            env('LIVEKIT_API_KEY'),
            env('LIVEKIT_API_SECRET')
        );
    }

    // Block a user
    public function blockUser(Request $request, $id)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is attempting to block user {$id}");

        if ($self->id == $id) {
            Log::warning("User {$self->id} tried to block themselves.");
            return response()->json(['error' => 'You cannot block yourself'], 400);
        }

        $blockedUser = User::find($id);

        if (!$blockedUser) {
            Log::error("User {$self->id} tried to block a non-existing user {$id}");
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if already blocked
        $existingBlock = Block::where('blocker_id', $self->id)
            ->where('blocked_id', $blockedUser->id)
            ->first();

        if ($existingBlock) {
            Log::info("User {$self->id} has already blocked user {$id}");
            return response()->json(['error' => 'Already blocked'], 400);
        }

        // Block the user
        $block = Block::create([
            'blocker_id' => $self->id,
            'blocked_id' => $blockedUser->id,
        ]);

        Log::info("User {$self->id} successfully blocked user {$id}");

        // Remove user from the LiveKit room if they're in
        try {
            $this->roomService->removeParticipant($self->id, $id);
            Log::info("Removed user {$id} from the LiveKit room.");
        } catch (\Exception $e) {
            Log::warning("User {$id} was not in the room or failed to remove from room.");
        }

        return response()->json($block);
    }

    // Unblock a user
    public function unblockUser(Request $request, $id)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is attempting to unblock user {$id}");

        $blockedUser = User::find($id);

        if (!$blockedUser) {
            Log::error("User {$self->id} tried to unblock a non-existing user {$id}");
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if the user is blocked
        $block = Block::where('blocker_id', $self->id)
            ->where('blocked_id', $blockedUser->id)
            ->first();

        if (!$block) {
            Log::info("User {$self->id} has not blocked user {$id}, so cannot unblock.");
            return response()->json(['error' => 'Not blocked'], 400);
        }

        // Unblock the user
        $block->delete();

        Log::info("User {$self->id} successfully unblocked user {$id}");

        return response()->json(['message' => 'User unblocked successfully']);
    }

    // Check if a user is blocked by the authenticated user
    public function isBlockedByUser(Request $request, $id)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is checking if user {$id} is blocked.");

        $blockedUser = User::find($id);

        if (!$blockedUser) {
            Log::error("User {$self->id} tried to check block status of a non-existing user {$id}");
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if blocked
        $existingBlock = Block::where('blocker_id', $blockedUser->id)
            ->where('blocked_id', $self->id)
            ->first();

        Log::info("User {$self->id} checked block status of user {$id}: " . ($existingBlock !== null ? 'Blocked' : 'Not Blocked'));

        return response()->json($existingBlock !== null);
    }

    // Get all blocked users
    public function getBlockedUsers(Request $request)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is requesting their list of blocked users.");

        $blockedUsers = Block::where('blocker_id', $self->id)
            ->with('blocked')
            ->get();

        Log::info("User {$self->id} has " . $blockedUsers->count() . " blocked users.");

        return response()->json($blockedUsers);
    }
}

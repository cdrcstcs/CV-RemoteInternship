<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import the Log facade

class FollowController extends Controller
{
    // Follow a user
    public function followUser(Request $request, $id)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is attempting to follow user {$id}");

        // Find the user to follow
        $userToFollow = User::find($id);

        if (!$userToFollow) {
            Log::error("User {$self->id} tried to follow a non-existing user {$id}");
            return response()->json(['error' => 'User not found'], 404);
        }

        // Ensure a user cannot follow themselves
        if ($self->id === $userToFollow->id) {
            Log::warning("User {$self->id} tried to follow themselves.");
            return response()->json(['error' => 'Cannot follow yourself'], 400);
        }

        // Check if already following
        $existingFollow = Follow::where('follower_id', $self->id)
            ->where('following_id', $userToFollow->id)
            ->first();

        if ($existingFollow) {
            Log::info("User {$self->id} is already following user {$id}");
            return response()->json(['error' => 'Already following'], 400);
        }

        // Create the follow relationship
        $follow = Follow::create([
            'follower_id' => $self->id,
            'following_id' => $userToFollow->id,
        ]);

        Log::info("User {$self->id} successfully followed user {$id}");

        // You can add revalidation or cache clearing here if needed

        return response()->json(['message' => 'Followed successfully', 'follow' => $follow]);
    }

    // Unfollow a user
    public function unfollowUser(Request $request, $id)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is attempting to unfollow user {$id}");

        // Find the user to unfollow
        $userToUnfollow = User::find($id);

        if (!$userToUnfollow) {
            Log::error("User {$self->id} tried to unfollow a non-existing user {$id}");
            return response()->json(['error' => 'User not found'], 404);
        }

        // Ensure a user cannot unfollow themselves
        if ($self->id === $userToUnfollow->id) {
            Log::warning("User {$self->id} tried to unfollow themselves.");
            return response()->json(['error' => 'Cannot unfollow yourself'], 400);
        }

        // Check if already following
        $existingFollow = Follow::where('follower_id', $self->id)
            ->where('following_id', $userToUnfollow->id)
            ->first();

        if (!$existingFollow) {
            Log::info("User {$self->id} is not following user {$id}.");
            return response()->json(['error' => 'Not following'], 400);
        }

        // Delete the follow relationship
        $existingFollow->delete();

        Log::info("User {$self->id} successfully unfollowed user {$id}");

        // You can add revalidation or cache clearing here if needed

        return response()->json(['message' => 'Unfollowed successfully']);
    }

    // Check if the user is following another user
    public function isFollowingUser(Request $request, $id)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is checking if they are following user {$id}");

        $userToCheck = User::find($id);

        if (!$userToCheck) {
            Log::error("User {$self->id} tried to check follow status of a non-existing user {$id}");
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if the current user is following the given user
        $existingFollow = Follow::where('follower_id', $self->id)
            ->where('following_id', $userToCheck->id)
            ->first();

        Log::info("User {$self->id} checked follow status of user {$id}: " . ($existingFollow !== null ? 'Following' : 'Not Following'));

        return response()->json(['isFollowing' => $existingFollow !== null]);
    }

    // Get the list of users that the current user is following
    public function getFollowedUsers(Request $request)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is requesting their list of followed users.");

        $followedUsers = Follow::where('follower_id', $self->id)
            ->whereHas('following', function ($query) use ($self) {
                $query->whereDoesntHave('blocks', function ($blockQuery) use ($self) {
                    $blockQuery->where('blocker_id', $self->id);
                });
            })
            ->with('following')
            ->get();

        Log::info("User {$self->id} has " . $followedUsers->count() . " followed users.");

        return response()->json($followedUsers);
    }
}

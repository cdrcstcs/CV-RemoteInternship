<?php

namespace App\Http\Controllers;

use App\Models\ConnectionRequest;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserConnection; // Include the UserConnection model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ConnectionRequestController extends Controller
{
    public function sendConnectionRequest(Request $request, $userId)
    {
        $senderId = $request->user()->id;
        Log::info('Sender ID sending connection request: ' . $senderId);

        if ($senderId == $userId) {
            return response()->json(['message' => "You can't send a request to yourself"], 400);
        }

        if (UserConnection::where('user_id', $senderId)->where('connection_id', $userId)->exists()) {
            return response()->json(['message' => "You are already connected"], 400);
        }

        $existingRequest = ConnectionRequest::where('sender_id', $senderId)
            ->where('recipient_id', $userId)
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => "A connection request already exists"], 400);
        }

        $newRequest = ConnectionRequest::create([
            'sender_id' => $senderId,
            'recipient_id' => $userId,
        ]);

        return response()->json(['message' => "Connection request sent successfully"], 201);
    }

    public function acceptConnectionRequest(Request $request, $requestId)
    {
        $userId = $request->user()->id;
        $connectionRequest = ConnectionRequest::findOrFail($requestId);

        if ($connectionRequest->recipient_id !== $userId) {
            return response()->json(['message' => "Not authorized to accept this request"], 403);
        }

        if ($connectionRequest->status !== 'pending') {
            return response()->json(['message' => "This request has already been processed"], 400);
        }

        $connectionRequest->status = 'accepted';
        $connectionRequest->save();

        // Use the UserConnection model to create connections
        UserConnection::create([
            'user_id' => $connectionRequest->sender_id,
            'connection_id' => $userId,
        ]);

        UserConnection::create([
            'user_id' => $userId,
            'connection_id' => $connectionRequest->sender_id,
        ]);

        Notification::create([
            'recipient_id' => $connectionRequest->sender_id,
            'type' => 'connectionAccepted',
            'related_user' => $userId,
        ]);

        return response()->json(['message' => "Connection accepted successfully"]);
    }

    public function rejectConnectionRequest(Request $request, $requestId)
    {
        $userId = $request->user()->id;
        $connectionRequest = ConnectionRequest::findOrFail($requestId);

        if ($connectionRequest->recipient_id !== $userId) {
            return response()->json(['message' => "Not authorized to reject this request"], 403);
        }

        if ($connectionRequest->status !== 'pending') {
            return response()->json(['message' => "This request has already been processed"], 400);
        }

        $connectionRequest->status = 'rejected';
        $connectionRequest->save();

        return response()->json(['message' => "Connection request rejected"]);
    }

    public function getConnectionRequests(Request $request)
    {
        $userId = $request->user()->id;
        Log::info('User ID fetching connection requests: ' . $userId);

        $requests = ConnectionRequest::where('recipient_id', $userId)
            ->where('status', 'pending')
            ->with('sender:id,name,username,profile_picture,headline')
            ->get();

        return response()->json($requests);
    }

    public function getUserConnections(Request $request)
    {
        $userId = $request->user()->id;

        // Fetch connections using the UserConnection model
        $connections = UserConnection::where('user_id', $userId)
            ->with('connection:id,username,profile_picture,headline') // Assuming you have the relationship set in UserConnection
            ->get();

        return response()->json($connections);
    }

    public function removeConnection(Request $request, $userId)
    {
        $myId = $request->user()->id;

        // Remove connections using the UserConnection model
        UserConnection::where('user_id', $myId)->where('connection_id', $userId)->delete();
        UserConnection::where('user_id', $userId)->where('connection_id', $myId)->delete();

        return response()->json(['message' => "Connection removed successfully"]);
    }

    public function getConnectionStatus(Request $request, $targetUserId)
    {
        $currentUserId = $request->user()->id;

        if (UserConnection::where('user_id', $currentUserId)->where('connection_id', $targetUserId)->exists()) {
            return response()->json(['status' => 'connected']);
        }

        $pendingRequest = ConnectionRequest::where(function ($query) use ($currentUserId, $targetUserId) {
            $query->where('sender_id', $currentUserId)
                  ->where('recipient_id', $targetUserId);
        })->orWhere(function ($query) use ($currentUserId, $targetUserId) {
            $query->where('sender_id', $targetUserId)
                  ->where('recipient_id', $currentUserId);
        })->where('status', 'pending')->first();

        if ($pendingRequest) {
            return response()->json(['status' => $pendingRequest->sender_id == $currentUserId ? 'pending' : 'received', 'requestId' => $pendingRequest->id]);
        }

        return response()->json(['status' => 'not_connected']);
    }
}

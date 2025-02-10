<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public static function getConversationsForSidebar(User $user)
    {
        $users = User::getUsersExceptUser($user);
        $groups = Group::getGroupsForUser($user);
        return $users->map(function (User $user) {
            return $user->toConversationArray();
        })->concat($groups->map(function (Group $group) {
            return $group->toConversationArray();
        }));
    }

    public static function updateConversationWithMessage($userId1, $userId2, $message)
    {
        // Find conversation, by user_id1 and user_id2 and update last message id
        $conversation = Conversation::where(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId1)
                ->where('user_id2', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId2)
                ->where('user_id2', $userId1);
        })->first();

        if ($conversation) {
            $conversation->update([
                'last_message_id' => $message->id,
            ]);
        } else {
            Conversation::create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' => $message->id,
            ]);
        }
    }
   
    public function fetchUserConversations(Request $request): JsonResponse
    {
        // Log incoming user ID and request details
        Log::info('Fetching user conversations', [
            'user_id' => request()->user()->id,
            'request' => $request->all(),  // Log the entire request for further details if needed
        ]);

        // Get all conversations where the authenticated user is either user_id1 or user_id2
        $conversations = Conversation::where('user_id1', request()->user()->id)
            ->orWhere('user_id2', request()->user()->id)
            ->latest()
            ->paginate(10);

        // Log conversations count and pagination details
        Log::info('Conversations fetched', [
            'user_id' => request()->user()->id,
            'total_conversations' => $conversations->total(),
            'current_page' => $conversations->currentPage(),
            'per_page' => $conversations->perPage(),
        ]);


        // Log the formatted conversations (you can choose not to log large data, or limit it if necessary)
        Log::info('Formatted conversations', [
            'conversations' => $conversations->toArray()  // Log formatted data
        ]);

        return response()->json($conversations);
    }

    /**
     * Get messages by user
     */
    public function byUser(Request $request, User $user): JsonResponse
    {
        $messages = Message::where('sender_id', request()->user()->id)
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', request()->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    /**
     * Get messages by group
     */
    public function byGroup(Request $request, Group $group): JsonResponse
    {
        $messages = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    /**
     * Load older messages based on the provided message
     */
    public function loadOlder(Request $request, Message $message): JsonResponse
    {
        // Load older messages that are older than the given message
        if ($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }

        // Return the messages as a resource
        return response()->json(MessageResource::collection($messages));
    }

    /**
     * Store a newly created message in storage.
     */
    public function store(Request $request, StoreMessageRequest $messageRequest): JsonResponse
    {
        $data = $messageRequest->validated();
        $data['sender_id'] = request()->user()->id; // Updated here
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $files = $data['attachments'] ?? [];

        $message = Message::create($data);

        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        // Update conversation or group with the message
        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, request()->user()->id, $message); // Updated here
        }

        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        // Dispatch the event
        SocketMessage::dispatch($message);

        // Return the created message as a resource
        return response()->json(new MessageResource($message), 201);
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(Request $request, Message $message): JsonResponse
    {
        // Check if the user is the sender of the message
        if ($message->sender_id !== request()->user()->id) { // Updated here
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $group = null;
        $conversation = null;
        // Check if the message is part of a group or conversation
        if ($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
        }

        // Delete the message
        $message->delete();

        // Get the new last message for the group or conversation
        $lastMessage = null;
        if ($group) {
            // Repopulate $group with the latest database data
            $group = Group::find($group->id);
            $lastMessage = $group->lastMessage;
        } else if ($conversation) {
            $conversation = Conversation::find($conversation->id);
            $lastMessage = $conversation->lastMessage;
        }

        // Return the last message or null
        return response()->json([
            'last_message' => $lastMessage ? new MessageResource($lastMessage) : null
        ]);
    }
}

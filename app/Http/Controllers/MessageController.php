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
use Carbon\Carbon;

class MessageController extends Controller
{

    public static function getConversationsForSidebar(Request $request): JsonResponse
    {
        $user = $request->user();

        // Query for group-to-user conversations with eager loading of users
        $queryForGroupToUser = Group::select(['groups.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            ->join('group_users', 'group_users.group_id', '=', 'groups.id')
            ->leftJoin('messages', 'messages.id', '=', 'groups.last_message_id')
            ->where('group_users.user_id', $user->id)
            ->with('users') // Ensure the users relationship is loaded
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('groups.name');

        // Query for user-to-user conversations
        $userId = $user->id;
        $queryForUserToUser = Conversation::select([
                'conversations.id', 
                'messages.message as last_message', 
                'messages.created_at as last_message_date', 
                'u1.first_name as user1_first_name', 
                'u1.last_name as user1_last_name', 
                'u2.first_name as user2_first_name', 
                'u2.last_name as user2_last_name', 
                'u2.profile_picture'
            ])
            ->leftJoin('users as u1', 'u1.id', '=', 'conversations.user_id1')
            ->leftJoin('users as u2', 'u2.id', '=', 'conversations.user_id2')
            ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
            ->where(function ($query) use ($userId) {
                $query->where('conversations.user_id1', $userId)
                    ->orWhere('conversations.user_id2', $userId);
            })
            ->orderByDesc('messages.created_at');

        // Map group conversations
        $groupConversations = $queryForGroupToUser->get()->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'description' => $group->description,
                'is_group' => true,
                'is_user' => false,
                'owner_id' => $group->owner_id,
                'users' => $group->users,
                'user_ids' => $group->users->pluck('id'),
                'last_message' => $group->last_message,
                'last_message_date' => $group->last_message_date ? (Carbon::parse($group->last_message_date)->toIso8601String())  : null, // Format the date correctly
            ];
        });

        // Map user-to-user conversations
        $userToUserConversations = $queryForUserToUser->get()->map(function ($conversation) use ($userId) {
            // Determine which user is the logged-in user and get the other user's details
            if ($conversation->user_id1 === $userId) {
                $otherUserFirstName = $conversation->user2_first_name;
                $otherUserLastName = $conversation->user2_last_name;
                $otherUserProfilePicture = $conversation->profile_picture;
            } else {
                $otherUserFirstName = $conversation->user1_first_name;
                $otherUserLastName = $conversation->user1_last_name;
                $otherUserProfilePicture = $conversation->profile_picture;
            }

            return [
                'id' => $conversation->id,
                'name' => $otherUserFirstName . ' ' . $otherUserLastName,
                'profile_picture' => $otherUserProfilePicture,
                'is_group' => false,
                'is_user' => true,
                'last_message' => $conversation->last_message,
                'last_message_date' => $conversation->last_message_date ?(Carbon::parse($conversation->last_message_date)->toIso8601String()) : null, // Format the date correctly
            ];
        });

        // Merge both conversations and sort by last message date
        $mergedConversations = $groupConversations->merge($userToUserConversations)->sortByDesc('last_message_date');

        return response()->json($mergedConversations);
    }

    public function updateConversationWithMessage(Request $request): JsonResponse
    {
        // Extract data from the request
        $userId1 = $request->input('user_id1');
        $userId2 = $request->input('user_id2');
        $messageContent = $request->input('message');

        // Create a new message instance
        $message = Message::create([
            'user_id' => $userId1,  // Assuming the user sending the message is user_id1
            'message' => $messageContent,
            // Add other necessary fields for the Message model
        ]);

        // Find conversation by user_id1 and user_id2, and update the last message ID
        $conversation = Conversation::where(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId1)
                ->where('user_id2', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId2)
                ->where('user_id2', $userId1);
        })->first();

        if ($conversation) {
            // Update the last_message_id if the conversation exists
            $conversation->update([
                'last_message_id' => $message->id,
            ]);
        } else {
            // Create a new conversation if it doesn't exist
            Conversation::create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' => $message->id,
            ]);
        }

        return response()->json(['message' => 'Conversation updated successfully']);
    }

    public function updateGroupWithMessage(Request $request): JsonResponse
    {
        // Extract data from the request
        $groupId = $request->input('group_id');
        $messageId = $request->input('message_id');        

        // Use updateOrCreate to either update the existing group or create a new one with the last message ID
        $group = Group::updateOrCreate(
            ['id' => $groupId], // search conditions (looking for group by ID)
            ['last_message_id' => $messageId] // values to update (set the last_message_id to the new message ID)
        );

        return response()->json(['message' => 'Group updated successfully']);
    }

    /**
     * Get messages by user
     */
    public function byUser(Request $request, $userId): JsonResponse
    {
        $messages = Message::where('sender_id', request()->user()->id)
            ->where('receiver_id', $userId)
            ->orWhere('sender_id', $userId)
            ->where('receiver_id', request()->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json(MessageResource::collection($messages));
    }

    /**
     * Get messages by group
     */
    public function byGroup($groupId): JsonResponse
    {
        $messages = Message::where('group_id', $groupId)
            ->latest()
            ->paginate(10);

        return response()->json(MessageResource::collection($messages));
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
        return response()->json(new MessageResource($message));
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
        return response()->json($lastMessage ? new MessageResource($lastMessage) : null);
    }
}

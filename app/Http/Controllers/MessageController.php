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


    public function store(Request $request, StoreMessageRequest $messageRequest): JsonResponse
    {
        // Validate and extract data from the request
        $data = $messageRequest->validated();
        $data['sender_id'] = request()->user()->id; // Set sender ID

        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $messageContent = $data['message']; // The actual message content
        $files = $data['attachments'] ?? []; // The attachments

        // Create a new message instance
        $message = Message::create($data);

        // Handle file attachments
        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $attachmentModel = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];

                $attachment = MessageAttachment::create($attachmentModel);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        // Update or create a conversation
        if ($receiverId) {
            // Find the conversation by user_id1 and user_id2, or create it if it doesn't exist
            $conversation = Conversation::where(function ($query) use ($receiverId) {
                $query->where('user_id1', request()->user()->id)
                    ->where('user_id2', $receiverId);
            })->orWhere(function ($query) use ($receiverId) {
                $query->where('user_id1', $receiverId)
                    ->where('user_id2', request()->user()->id);
            })->first();

            if ($conversation) {
                // If conversation exists, update the last_message_id
                $conversation->update([
                    'last_message_id' => $message->id,
                ]);
            } else {
                // Create a new conversation if it doesn't exist
                Conversation::create([
                    'user_id1' => request()->user()->id,
                    'user_id2' => $receiverId,
                    'last_message_id' => $message->id,
                ]);
            }
        }

        // Update the group if the groupId is provided
        if ($groupId) {
            // Use updateOrCreate to update or create the group with the last_message_id
            Group::updateOrCreate(
                ['id' => $groupId], // search conditions (looking for group by ID)
                ['last_message_id' => $message->id] // values to update (set the last_message_id to the new message ID)
            );
        }

        // Dispatch the message event for broadcasting
        SocketMessage::dispatch($message);

        // Return the created message as a response, formatted with MessageResource
        return response()->json(new MessageResource($message));
    }

    /**
     * Get messages by user or group
     */
    public function getMessages(Request $request, $id): JsonResponse
    {
        // Check if the ID belongs to a user or group by some identifier (e.g., `is_user` in the request)
        $isUser = $request->query('isUser', false); // You can set 'isUser' as a query parameter

        if ($isUser) {
            // Fetch messages between the current user and the specified user
            $messages = Message::where('sender_id', request()->user()->id)
                ->where('receiver_id', $id)
                ->orWhere('sender_id', $id)
                ->where('receiver_id', request()->user()->id)
                ->latest()
                ->paginate(10);
        } else {
            // Fetch messages for a group
            $messages = Message::where('group_id', $id)
                ->latest()
                ->paginate(10);
        }

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
     * Remove the specified message from storage.
     */
    public function deleteMessage(Request $request, $messageId): JsonResponse
    {
        $message = Message::find($messageId);
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

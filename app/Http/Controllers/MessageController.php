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

class MessageController extends Controller
{
    /**
     * Get messages by user
     */
    public function byUser(User $user): JsonResponse
    {
        $messages = Message::where('sender_id', auth()->id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
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
    public function byGroup(Group $group): JsonResponse
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
    public function loadOlder(Message $message): JsonResponse
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
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
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
            Conversation::updateConversationWithMessage($receiverId, auth()->id(), $message);
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
    public function destroy(Message $message): JsonResponse
    {
        // Check if the user is the sender of the message
        if ($message->sender_id !== auth()->id()) {
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

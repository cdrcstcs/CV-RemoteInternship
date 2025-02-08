<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public Message $message;

    /**
     * Create a new event instance.
     *
     * @param Message $message
     * @return void
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * The data to broadcast with the event.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        // Make sure the MessageResource is properly wrapping the message
        return [
            'message' => new MessageResource($this->message),
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $m = $this->message;
        $channels = [];

        // If the message belongs to a group, broadcast to the group channel
        if ($m->group_id) {
            $channels[] = new PrivateChannel('message.group.' . $m->group_id);
        } else {
            // For private messages, ensure the user-to-user channel is created correctly
            $userIds = collect([$m->sender_id, $m->receiver_id])->sort()->implode('-');
            $channels[] = new PrivateChannel('message.user.' . $userIds);
        }

        return $channels;
    }
}

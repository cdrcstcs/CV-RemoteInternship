<?php

namespace App\Events;

use App\Models\Stream;
use App\Models\StreamMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class StreamChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $streamMessage; // The StreamMessage data you want to broadcast

    /**
     * Create a new event instance.
     *
     * @param StreamMessage $streamMessage
     */
    public function __construct(StreamMessage $streamMessage)
    {
        $this->streamMessage = $streamMessage;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel
     */
    public function broadcastOn()
    {
        // Broadcasting on a channel related to the stream
        return new Channel('stream-chat.' . $this->streamMessage->stream_id);
    }

    /**
     * The data to broadcast with the event.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'message' => $this->streamMessage->message,
            'creator' => [
                'id' => $this->streamMessage->creator_id,
                'first_name' => $this->streamMessage->creator->first_name,
                'last_name' => $this->streamMessage->creator->last_name,
            ],
            'viewer' => [
                'id' => $this->streamMessage->viewer_id,
                'first_name' => $this->streamMessage->viewer->first_name,
                'last_name' => $this->streamMessage->viewer->last_name,
            ],
            'stream_id' => $this->streamMessage->stream_id,
        ];
    }
}

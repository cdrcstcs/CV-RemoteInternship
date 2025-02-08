<?php

namespace App\Events;

use App\Http\Resources\GroupResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $id;
    public string $name;

    /**
     * Create a new event instance.
     *
     * @param int $id
     * @param string $name
     * @return void
     */
    public function __construct(int $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            // Using PrivateChannel with a dynamic channel name for group deletion
            new PrivateChannel('group.deleted.' . $this->id),
        ];
    }

    /**
     * Optionally, you can broadcast additional data like name, but it's usually good practice
     * to broadcast only necessary data for your frontend to consume.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}

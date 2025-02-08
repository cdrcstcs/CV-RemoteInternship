<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteGroupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The group instance.
     *
     * @var Group
     */
    public Group $group;

    /**
     * Create a new job instance.
     */
    public function __construct(Group $group)
    {
        $this->group = $group;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get group details
        $id = $this->group->id;
        $name = $this->group->name;

        // Detach any associated users
        $this->group->users()->detach();

        // Delete all associated messages in one query to avoid loading them into memory
        $this->group->messages()->delete();

        // Set last_message_id to null before deleting the group
        $this->group->last_message_id = null;
        $this->group->save();

        // Finally, delete the group
        $this->group->delete();

        // Dispatch the group deleted event after deletion
        GroupDeleted::dispatch($id, $name);
    }
}

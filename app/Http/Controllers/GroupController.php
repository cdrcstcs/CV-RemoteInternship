<?php

namespace App\Http\Controllers;

use App\Jobs\DeleteGroupJob;
use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use Illuminate\Http\JsonResponse;

class GroupController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request): JsonResponse
    {
        // Validate the request data
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];

        // Create the group
        $group = Group::create($data);

        // Attach users to the group, including the current authenticated user
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        // Return a JSON response with the created group data
        return response()->json([
            'message' => 'Group created successfully',
            'data' => $group
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group): JsonResponse
    {
        // Validate the request data
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];

        // Update the group with the new data
        $group->update($data);

        // Remove all current users and attach the new ones
        $group->users()->detach();
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        // Return a JSON response confirming the update
        return response()->json([
            'message' => 'Group updated successfully',
            'data' => $group
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group): JsonResponse
    {
        // Check if the authenticated user is the owner of the group
        if ($group->owner_id !== auth()->id()) {
            // If the user is not the owner, return a 403 Forbidden response
            return response()->json([
                'message' => 'You are not authorized to delete this group'
            ], 403);
        }

        // Dispatch the group deletion job with a delay
        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(10));

        // Return a JSON response indicating that the deletion was scheduled
        return response()->json([
            'message' => 'Group delete was scheduled and will be deleted soon'
        ]);
    }
}

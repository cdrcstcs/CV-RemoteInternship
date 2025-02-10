<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function getSuggestedConnections(Request $request)
    {
        try {
            // Ensure user is authenticated
            $currentUser = $request->user();
            
            // Fetch all users except the current user
            $allUsers = User::where('id', '!=', $currentUser->id)
                ->select('id', 'first_name','last_name','phone_number','email','language','profile_picture','banner_img','headline','about')
                ->orderBy('created_at', 'desc') // Sort by created_at, latest first
                ->limit(10)
                ->get();
    
            return response()->json($allUsers);
        } catch (\Exception $error) {
            \Log::error("Error in getSuggestedConnections controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public static function getUsersExceptUser(User $user)
    {
        $userId = $user->id;
        $query = User::select(['users.*', 
                            'messages.message as last_message', 
                            'messages.created_at as last_message_date'])
                    ->where('users.id', '!=', $userId)
                    ->leftJoin('conversations', function ($join) use ($userId) {
                        $join->on('conversations.user_id1', '=', 'users.id')
                            ->where('conversations.user_id2', '=', $userId)
                            ->orWhere(function ($query) use ($userId) {
                                $query->on('conversations.user_id2', '=', 'users.id')
                                    ->where('conversations.user_id1', '=', $userId);
                            });
                    })
                    ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
                    ->orderByRaw('CONCAT(users.first_name, " ", users.last_name)')  // Correct order by name concatenation
                    ->orderByDesc('messages.created_at')  // Ensure we order by the most recent message
        ;

        return $query->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,  // Added value for first_name
            'last_name' => $this->last_name,    // Added value for last_name
            'profile_picture' => $this->profile_picture,  // Added value for profile_picture
            'is_group' => false,                 // Assuming this is always false
            'is_user' => true,                   // Assuming this is always true
            'created_at' => $this->created_at,   // Added value for created_at
            'updated_at' => $this->updated_at,   // Added value for updated_at
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date ? \Carbon\Carbon::parse($this->last_message_date)->toDateTimeString() : null, // Format date properly
        ];
    }
    
}

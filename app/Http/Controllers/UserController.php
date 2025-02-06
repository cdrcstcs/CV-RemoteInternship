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
                ->select('id', 'name', 'username', 'profile_picture', 'headline')
                ->orderBy('created_at', 'desc') // Sort by created_at, latest first
                ->limit(10)
                ->get();
    
            return response()->json($allUsers);
        } catch (\Exception $error) {
            \Log::error("Error in getSuggestedConnections controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
    
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
                ->limit(30)
                ->get();
    
            return response()->json($allUsers);
        } catch (\Exception $error) {
            \Log::error("Error in getSuggestedConnections controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
    public function updateHeadlineAndAbout(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'headline' => 'nullable|string|max:255',
            'about' => 'nullable|string|max:1000',
        ]);

        // If validation fails, return an error response
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Get the currently authenticated user
        $user = $request->user();

        // Update the user's headline and about attributes
        $user->update([
            'headline' => $request->input('headline', $user->headline),
            'about' => $request->input('about', $user->about),
        ]);

        // Return a success response
        return response()->json($user);
    }
}

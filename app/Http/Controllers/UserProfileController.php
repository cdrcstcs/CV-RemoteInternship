<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;

class UserProfileController extends Controller
{

    // Update user details (first name, last name, email, etc.)
    public function updateDetails(Request $request)
    {
        $user = $request->user();

        // Validate the request data
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone_number' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:10',
        ]);

        // Update user details
        $user->update($validated);

        // Return updated user profile as JSON
        return response()->json($user);
    }

    // Update the user's password
    public function updatePassword(Request $request)
    {
        // Validate the password data
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8', // Must be confirmed
        ]);

        $user = $request->user();

        // Check if the current password matches
        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        // Update the password
        $user->update([
            'password' => Hash::make($validated['newPassword']),
        ]);

        // Return success response
        return response()->json(['message' => 'Password updated successfully']);
    }
}

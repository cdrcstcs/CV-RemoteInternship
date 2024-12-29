<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // Signup method
    public function signup(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email|max:255',
            'phone_number' => 'nullable|string|max:15', // Optional field for phone number
            'ip_address' => 'nullable|ip', // Optional field for IP address
            'password' => 'required|string|min:6',
            'language' => 'nullable|string|max:2', // Optional language code (e.g., 'en', 'fr')
        ]);

        // Handle validation failure
        if ($validator->fails()) {
            Log::warning('Signup validation failed', $validator->errors()->toArray());
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            // Create the user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'ip_address' => $request->ip_address,
                'language' => $request->language ?? 'en', // Default to 'en' if not provided
                'password' => Hash::make($request->password),
            ]);

            // Create a new token for the user
            $token = $user->createToken('token-name')->plainTextToken;

            // Return all user details along with the token
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token
            ], 201);
        } catch (\Exception $error) {
            Log::error("Signup error: ", ['error' => $error->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    // Login method
    public function login(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string',
        ]);

        // Handle validation failure
        if ($validator->fails()) {
            Log::warning('Login validation failed', $validator->errors()->toArray());
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        // Attempt to log the user in
        $credentials = $request->only('email', 'password');
        Log::info('Login attempt', $credentials);

        // Find the user by email first
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            Log::warning('Invalid login credentials', $credentials);
            return response()->json(['message' => 'Invalid credentials'], 400);
        }

        // Log the user in
        Auth::login($user);

        // Generate the token
        $token = $user->createToken('token-name')->plainTextToken;

        // Optionally, you can log the successful login
        Log::info('User logged in successfully', ['user_id' => $user->id]);

        // Return all user details along with the token
        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
            'token' => $token
        ]);
    }

    // Logout method
    public function logout(Request $request)
    {
        Log::info('Login attempt', ['kk'=>$request->user()->id]);
        try {
            if (!$request->user()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            // Delete all tokens for the user
            $request->user()->tokens()->delete(); // Revoke all tokens

            // Optionally, log out session-based authentication
            Auth::logout();

            // Log the logout action
            Log::info('User logged out successfully', ['user_id' => $request->user()->id]);

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $error) {
            Log::error("Logout error: ", ['error' => $error->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function getCurrentUser(Request $request)
    {
        // Return the authenticated user
        return response()->json($request->user());
    }
}

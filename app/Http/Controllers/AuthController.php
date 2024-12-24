<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Cookie;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Redis;
use Carbon\Carbon;

class AuthController extends Controller
{
    // Signup user
    public function signup(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone_number' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'language' => 'nullable|string|in:en,es,fr',  // You can extend this list as per requirement
            'two_factor_enabled' => 'nullable|boolean',
        ]);

        try {
            // Create the user in the database
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_number' => $request->phone_number,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'language' => $request->language ?? 'en', // Default to 'en' if no language is provided
                'two_factor_enabled' => $request->two_factor_enabled ?? false, // Default to false
            ]);

            // Generate tokens
            $tokens = $this->generateTokens($user->id);

            // Store the refresh token in Redis
            $this->storeRefreshToken($user->id, $tokens['refresh_token']);

            // Set cookies
            $this->setCookies($tokens['access_token'], $tokens['refresh_token']);

            return response()->json([
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'language' => $user->language,
                'two_factor_enabled' => $user->two_factor_enabled,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error in signup', 'error' => $e->getMessage()], 500);
        }
    }

    // Login user
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                $tokens = $this->generateTokens($user->id);

                // Store the refresh token in Redis
                $this->storeRefreshToken($user->id, $tokens['refresh_token']);

                // Set cookies
                $this->setCookies($tokens['access_token'], $tokens['refresh_token']);

                return response()->json([
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'language' => $user->language,
                    'two_factor_enabled' => $user->two_factor_enabled,
                ]);
            } else {
                return response()->json(['message' => 'Invalid credentials'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error in login', 'error' => $e->getMessage()], 500);
        }
    }

    // Logout user
    public function logout(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refreshToken');
            if ($refreshToken) {
                $decoded = JWTAuth::decode($refreshToken);
                Redis::del("refresh_token:{$decoded['sub']}");
            }

            // Clear cookies
            Cookie::queue(Cookie::forget('accessToken'));
            Cookie::queue(Cookie::forget('refreshToken'));

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error in logout', 'error' => $e->getMessage()], 500);
        }
    }

    // Refresh access token
    public function refreshToken(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refreshToken');

            if (!$refreshToken) {
                return response()->json(['message' => 'No refresh token provided'], 401);
            }

            $decoded = JWTAuth::decode($refreshToken);
            $storedToken = Redis::get("refresh_token:{$decoded['sub']}");

            if ($storedToken !== $refreshToken) {
                return response()->json(['message' => 'Invalid refresh token'], 401);
            }

            $accessToken = JWTAuth::fromUser(User::find($decoded['sub']));

            // Set new access token in cookies
            Cookie::queue(Cookie::make('accessToken', $accessToken, 15, null, null, true, true));

            return response()->json(['message' => 'Token refreshed successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error in refreshing token', 'error' => $e->getMessage()], 500);
        }
    }

    // Get user profile
    public function getProfile(Request $request)
    {
        try {
            return response()->json($request->user());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching profile', 'error' => $e->getMessage()], 500);
        }
    }

    // Helper method to generate JWT tokens
    private function generateTokens($userId)
    {
        $accessToken = JWTAuth::fromUser(User::find($userId));
        $refreshToken = JWTAuth::fromUser(User::find($userId), ['exp' => Carbon::now()->addDays(7)->timestamp]);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ];
    }

    // Helper method to store refresh token in Redis
    private function storeRefreshToken($userId, $refreshToken)
    {
        Redis::setex("refresh_token:{$userId}", 7 * 24 * 60 * 60, $refreshToken); // expires in 7 days
    }

    // Helper method to set access and refresh tokens in cookies
    private function setCookies($accessToken, $refreshToken)
    {
        Cookie::queue(Cookie::make('accessToken', $accessToken, 15, null, null, true, true));  // 15 minutes
        Cookie::queue(Cookie::make('refreshToken', $refreshToken, 7 * 24 * 60, null, null, true, true));  // 7 days
    }
}

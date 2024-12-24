<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ProtectRoute
{
    public function handle(Request $request, Closure $next)
    {
        // Check if token is in cookies
        $token = $request->cookie('accessToken');

        if (!$token) {
            return response()->json(['message' => 'Unauthorized - No access token provided'], 401);
        }

        try {
            // Attempt to decode the token and get the user
            $user = JWTAuth::authenticate($token);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 401);
            }

            // Attach the user to the request
            $request->user = $user;

            return $next($request);
        } catch (JWTException $e) {
            Log::error('JWT Error: ' . $e->getMessage());

            return response()->json(['message' => 'Unauthorized - Invalid or expired access token'], 401);
        }
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleRoute
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check if the user exists and has the required role(s)
        if ($request->user && in_array($request->user->role, $roles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Access denied - Unauthorized role'], 403);
    }
}

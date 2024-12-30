<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\UserRole;
use App\Models\Role;
use Illuminate\Support\Facades\Log; // Import the Log facade

class RoleRoute
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Log the incoming request details (e.g., user IP, requested route, etc.)
        Log::info('RoleRoute Middleware triggered', [
            'user_ip' => $request->ip(),
            'requested_route' => $request->path(),
            'roles_required' => $roles,
        ]);

        // Get the authenticated user
        $user = $request->user();

        // Check if the user exists
        if (!$user) {
            Log::warning('User not authenticated', [
                'requested_route' => $request->path(),
                'user_ip' => $request->ip(),
            ]);
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Log the user's roles
        $userRoleIds = UserRole::where('users_id', $user->id)->pluck('roles_id');
        Log::info('User roles retrieved', [
            'user_id' => $user->id,
            'roles_ids' => $userRoleIds,
        ]);

        // Fetch the role names from the Role table
        $userRoles = Role::whereIn('id', $userRoleIds)
            ->pluck('role_name')
            ->map(function ($roleName) {
                return strtolower($roleName);  // Convert role names to lowercase
            })
            ->toArray();

        // Convert all provided roles to lowercase for case-insensitive comparison
        $roles = array_map('strtolower', $roles);

        // Log the comparison between user's roles and required roles
        Log::info('Checking if user has required roles', [
            'user_roles' => $userRoles,
            'roles_required' => $roles,
        ]);

        // Check if the user has one of the required roles (case-insensitive)
        if (array_intersect($roles, $userRoles)) {
            Log::info('Access granted', [
                'user_id' => $user->id,
                'user_roles' => $userRoles,
                'requested_route' => $request->path(),
            ]);
            return $next($request);
        }

        // Log when access is denied
        Log::warning('Access denied - Unauthorized role', [
            'user_id' => $user->id,
            'user_roles' => $userRoles,
            'requested_route' => $request->path(),
            'roles_required' => $roles,
        ]);

        // Return response if the user doesn't have the required role
        return response()->json(['message' => 'Access denied - Unauthorized role'], 403);
    }
}

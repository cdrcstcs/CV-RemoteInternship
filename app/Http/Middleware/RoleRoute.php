<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\UserRole;
use App\Models\Role;

class RoleRoute
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Get the authenticated user
        $user = $request->user();

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Get the role_ids assigned to the user from the UserRole table
        $userRoleIds = UserRole::where('users_id', $user->id)->pluck('roles_id');

        // Fetch the role names from the Role table using the role_ids (case-insensitive comparison)
        $userRoles = Role::whereIn('id', $userRoleIds)
            ->pluck('role_name')
            ->map(function ($roleName) {
                return strtolower($roleName);  // Convert role names to lowercase
            })
            ->toArray();

        // Convert all provided roles to lowercase for case-insensitive comparison
        $roles = array_map('strtolower', $roles);

        // Check if the user has one of the required roles (case-insensitive)
        if (array_intersect($roles, $userRoles)) {
            return $next($request);
        }

        // Return response if the user doesn't have the required role
        return response()->json(['message' => 'Access denied - Unauthorized role'], 403);
    }
}

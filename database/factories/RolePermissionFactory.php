<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Database\Eloquent\Factories\Factory;

class RolePermissionFactory extends Factory
{
    protected $model = RolePermission::class;

    public function definition()
    {
        return [
            'roles_id' => Role::factory(),         // Assuming a Role factory exists
            'permissions_id' => Permission::factory(), // Assuming a Permission factory exists
        ];
    }
}

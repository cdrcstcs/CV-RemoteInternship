<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserRoleFactory extends Factory
{
    protected $model = UserRole::class;

    public function definition()
    {
        return [
            'users_id' => User::factory(),  // Assuming a User factory exists
            'roles_id' => Role::factory(),  // Assuming a Role factory exists
        ];
    }
}

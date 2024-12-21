<?php

namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'permission_name' => $this->faker->word, // Random permission name, e.g., 'edit_post', 'delete_user'
            'description' => $this->faker->sentence, // Random description of the permission
        ];
    }
}

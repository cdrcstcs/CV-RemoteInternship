<?php

namespace Database\Factories;

use App\Models\UserConnection;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
class UserConnectionFactory extends Factory
{
    protected $model = UserConnection::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(), // Create a new user for user_id
            'connection_id' => User::factory(), // Create a new user for connection_id
        ];
    }
}

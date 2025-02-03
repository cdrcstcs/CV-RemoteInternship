<?php

namespace Database\Factories;

use App\Models\ConnectionRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConnectionRequestFactory extends Factory
{
    protected $model = ConnectionRequest::class;

    public function definition()
    {
        return [
            'sender_id' => User::factory(), // Creates a new user for the sender
            'recipient_id' => User::factory(), // Creates a new user for the recipient
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }
}

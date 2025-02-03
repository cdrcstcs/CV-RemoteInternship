<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        return [
            'recipient_id' => User::factory(), // Creates a new user for the recipient
            'type' => $this->faker->randomElement(['like', 'comment', 'connectionAccepted']),
            'related_user' => User::factory(),
            'related_post' => Post::factory(),
            'read' => $this->faker->boolean(),
        ];
    }
}

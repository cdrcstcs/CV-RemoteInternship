<?php

namespace Database\Factories;

use App\Models\Like;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class LikeFactory extends Factory
{
    protected $model = Like::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(), // Creates a new user for each like
            'post_id' => Post::factory(), // Creates a new post for each like, adjust as needed
        ];
    }
}

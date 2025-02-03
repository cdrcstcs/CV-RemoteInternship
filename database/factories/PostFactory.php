<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment; // Ensure to import the Comment model
use App\Models\Like; // Import the Like model
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'author_id' => User::factory(), // Creates a new user for the author
            'content' => $this->faker->paragraph(),
            'image' => $this->faker->imageUrl(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Post $post) {
            // Create comments for the post
            Comment::factory()
                ->count(3) // Adjust the count as needed
                ->create([
                    'post_id' => $post->id,
                    'user_id' => User::factory(), // Creates a new user for each comment
                ]);

            // Create likes for the post
            // Change the number of likes as needed
            $likeCount = 5; // For example, create 5 likes
            for ($i = 0; $i < $likeCount; $i++) {
                Like::factory()->create([
                    'post_id' => $post->id,
                    'user_id' => User::factory(), // Creates a new user for each like
                ]);
            }
        });
    }
}

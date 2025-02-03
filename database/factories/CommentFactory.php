<?php
namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition()
    {
        return [
            'post_id' => Post::factory(), // Creates a new post for the comment
            'user_id' => User::factory(), // Creates a new user for the comment
            'content' => $this->faker->sentence(), // Random content for the comment
        ];
    }
}

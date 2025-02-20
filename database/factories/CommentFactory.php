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
        $comments = [
            'This product is amazing! Exactly as described, will definitely buy again.',
            'Great quality and fast shipping, I am very happy with my purchase.',
            'The product didn’t meet my expectations. It arrived damaged.',
            'I love this item! It works perfectly and was easy to use.',
            'Not worth the price, I found a better alternative elsewhere.',
            'Shipping took longer than expected, but the product is great.',
            'Excellent customer service, the seller was very helpful with my inquiries.',
            'I am very satisfied with this purchase, highly recommend it!',
            'It’s okay, but I expected more for the price.',
            'The product is good but has some minor defects.',
        ];

        return [
            'post_id' => Post::factory(), // Creates a new post for the comment
            'user_id' => User::factory(), // Creates a new user for the comment
            'content' => $this->faker->randomElement($comments), // Picks a random comment from the array
        ];
    }
}

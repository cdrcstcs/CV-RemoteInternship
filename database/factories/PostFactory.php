<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    // Collection of image URLs
    private static $imageUrls = [
        'https://cdn.thewirecutter.com/wp-content/media/2024/11/runningshoes-2048px-09522.jpg?auto=webp&quality=75&width=1024', // Placeholder image
        'https://m.media-amazon.com/images/I/61V98P7+jiL.jpg',
        'https://down-sg.img.susercontent.com/file/2520047a3506c1dc94f41677d129f540',
        'https://cdn.thewirecutter.com/wp-content/media/2024/05/white-sneaker-2048px-9320.jpg?auto=webp&quality=75&crop=1.91:1&width=1200',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzCINXMUbqCfb_MnCjyooBavt2dYK-gVrBQ&s',
        'https://assets.vogue.com/photos/5891e0ebb482c0ea0e4db2a8/4:3/w_2560%2Cc_limit/02-lestrange.jpg',
        'https://i.ebayimg.com/images/g/sTgAAOSwinJk3YuY/s-l1200.jpg',
        'https://marilyn.nz/wp-content/uploads/2021/12/Morilee-Wedding-Dress-5960-Feature.webp'
    ];

    public function definition()
    {
        return [
            'author_id' => User::factory(), // Creates a new user for the author
            'content' => $this->faker->paragraph(),
            'image' => $this->getRandomImage(), // Randomly selected image URL
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
            $likeCount = 5; // For example, create 5 likes
            for ($i = 0; $i < $likeCount; $i++) {
                Like::factory()->create([
                    'post_id' => $post->id,
                    'user_id' => User::factory(), // Creates a new user for each like
                ]);
            }
        });
    }

    /**
     * Get a random image URL from the collection.
     *
     * @return string
     */
    private function getRandomImage(): string
    {
        // Randomly select an image URL from the collection
        return self::$imageUrls[array_rand(self::$imageUrls)];
    }
}

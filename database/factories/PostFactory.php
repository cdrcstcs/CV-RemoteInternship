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
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcarmellamarketing.com%2F2023%2F05%2F09%2Fproduct-photography-ecommerce-success%2F&psig=AOvVaw0KmEMutxZZnTiYBYZOKxij&ust=1738986748220000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjhj83UsIsDFQAAAAAdAAAAABAE', // Placeholder image
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdifferent-products&psig=AOvVaw0KmEMutxZZnTiYBYZOKxij&ust=1738986748220000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjhj83UsIsDFQAAAAAdAAAAABAJ', // Random image from Picsum
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffr.freepik.com%2Fimages-ia-premium%2Fecommerce-apple-tous-produits-devices_48812450.htm&psig=AOvVaw0KmEMutxZZnTiYBYZOKxij&ust=1738986748220000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjhj83UsIsDFQAAAAAdAAAAABAY', // Random kitten image
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiamart.com%2Fproddetail%2Fecommerce-product-photography-services-2851799262288.html&psig=AOvVaw0FQCsFnVW5P_LBxJqHVH7D&ust=1738986811335000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjcnOzUsIsDFQAAAAAdAAAAABAE', // Bill Murray image
        'https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.maki.vn%2Fblog%2Fchup-anh-quang-cao-san-pham-doc-dao&psig=AOvVaw1FdTyoDIVpM1a92rXNAt6P&ust=1738986837159000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCc2vvUsIsDFQAAAAAdAAAAABAE', // Random male portrait
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstudios.vn%2Fblog%2Fconcept-chup-anh-quang-cao-dot-pha&psig=AOvVaw1FdTyoDIVpM1a92rXNAt6P&ust=1738986837159000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCc2vvUsIsDFQAAAAAdAAAAABAJ', // Random female portrait
        // Add more URLs here as needed
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

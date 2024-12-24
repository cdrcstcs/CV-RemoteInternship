<?php
namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // List of image URLs you can use for testing. Add more URLs as needed.
        $imageUrls = [
            '/1.png',
            '/2.png',
            '/3.png',
            '/4.png',
            '/5.png',
            '/6.png',
            '/7.png',
            '/8.png',
        ];

        return [
            'name' => $this->faker->word, // Random product name
            'price' => $this->faker->randomFloat(2, 1, 1000), // Random price between 1 and 1000 with 2 decimals
            'description' => $this->faker->paragraph, // Random product description
            'supplier_id' => User::factory(), // Randomly associate a user (supplier) using the User factory
            'isFeatured' => $this->faker->boolean(50), // Randomly set the isFeatured column to true (50% chance)
            'image' => $this->faker->randomElement($imageUrls), // Select a random image URL from the list
        ];
    }
}

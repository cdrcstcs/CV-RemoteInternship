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
        // List of real product names
        $productNames = [
            'Bose QuietComfort 35 II Wireless Headphones',
            'Samsung 65" QLED 4K Smart TV',
            'Fitbit Charge 5 Fitness and Health Tracker',
            'JBL Flip 5 Waterproof Bluetooth Speaker',
            'Wüsthof Classic 7-Piece Knife Set',
            'Fossil Men’s RFID-Blocking Leather Wallet',
            'Nike Air Zoom Pegasus 38 Running Shoes',
            'Breville Smart Kettle with Temperature Control',
            'Anker PowerCore 20000mAh Portable Charger',
            'Herman Miller Aeron Ergonomic Office Chair'
        ];

        // List of real product descriptions for e-commerce
        $descriptions = [
            'High-quality wireless headphones with noise cancellation, deep bass, and up to 20 hours of battery life.',
            'Ultra HD 4K Smart TV with built-in streaming apps, voice control, and a slim, modern design.',
            'Track your fitness goals, heart rate, steps, calories burned, and more with this stylish smartwatch.',
            'Water-resistant Bluetooth speaker with crystal-clear sound, deep bass, and 12 hours of continuous playtime.',
            'Professional-grade stainless steel kitchen knife set with ergonomic handles and razor-sharp blades for all your cooking needs.',
            'Stylish and durable leather wallet with multiple card slots, a coin pocket, and a sleek, minimalist design.',
            'Comfortable, lightweight, and durable running shoes designed for both long-distance runs and casual wear.',
            'Cordless electric kettle with rapid boiling capabilities, temperature control, and automatic shut-off for safety and convenience.',
            'Portable power bank with a high capacity to charge your devices multiple times, perfect for travel or emergencies.',
            'Ergonomic office chair with adjustable height, lumbar support, and breathable mesh fabric for all-day comfort.'
        ];

        // Randomly select a product name and description
        $name = $this->faker->randomElement($productNames);
        $description = $this->faker->randomElement($descriptions);

        // List of image URLs for products
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
            'name' => $name, // Real product name from the list
            'price' => $this->faker->randomFloat(2, 1, 1000), // Random price between 1 and 1000 with 2 decimals
            'description' => $description, // Real product description from the list
            'supplier_id' => User::factory(), // Randomly associate a user (supplier) using the User factory
            'isFeatured' => $this->faker->boolean(50), // Randomly set the isFeatured column to true (50% chance)
            'image' => $this->faker->randomElement($imageUrls), // Select a random image URL from the list
        ];
    }
}

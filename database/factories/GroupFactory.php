<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined set of group names and descriptions for e-commerce.
        $groupNames = [
            'Electronics',
            'Fashion',
            'Home & Living',
            'Beauty & Personal Care',
            'Sports & Outdoors',
            'Toys & Games',
            'Books & Media',
            'Health & Wellness',
            'Automotive',
            'Food & Groceries'
        ];

        $groupDescriptions = [
            'Explore a wide range of electronics, including the latest gadgets and devices.',
            'Trendy fashion items, clothing, accessories, and shoes for every season.',
            'Furniture, home decor, and appliances to help you create the perfect home.',
            'Top-quality beauty and personal care products to keep you feeling your best.',
            'Everything you need for your outdoor adventures and fitness goals.',
            'Toys, games, and activities for children of all ages.',
            'A vast collection of books, movies, and music to entertain and educate.',
            'Products for your health and well-being, from supplements to fitness equipment.',
            'Car accessories, parts, and tools for maintaining your vehicle.',
            'Fresh food, snacks, and groceries delivered to your doorstep.'
        ];

        return [
            'name' => $this->faker->randomElement($groupNames), // Pick a random group name from the predefined list
            'description' => $this->faker->randomElement($groupDescriptions), // Pick a random description
            'owner_id' => User::inRandomOrder()->first()->id, // Assign a random user as the owner
        ];
    }
}

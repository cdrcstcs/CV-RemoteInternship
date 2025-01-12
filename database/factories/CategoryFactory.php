<?php
namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined real category names and descriptions
        $categories = [
            ['category_name' => 'Technology', 'description' => 'Latest advancements in technology and gadgets'],
            ['category_name' => 'Health & Wellness', 'description' => 'Tips and information on staying healthy'],
            ['category_name' => 'Business', 'description' => 'Insights on entrepreneurship and business trends'],
            ['category_name' => 'Education', 'description' => 'Resources and knowledge for personal growth'],
            ['category_name' => 'Fashion', 'description' => 'Trends and styles in the fashion world'],
            // Add more categories as needed
        ];

        // Randomly pick a category from the list
        $category = $categories[array_rand($categories)];

        return [
            'category_name' => $category['category_name'],
            'description' => $category['description'],
        ];
    }
}

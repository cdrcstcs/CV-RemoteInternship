<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCategoryFactory extends Factory
{
    // Define the associated model
    protected $model = ProductCategory::class;

    public function definition()
    {
        // Get random product and category IDs from existing records
        return [
            'products_id' => Product::factory(),  // Random product
            'categories_id' => Category::factory(),  // Random category
        ];
    }
}

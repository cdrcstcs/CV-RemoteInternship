<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition()
    {
        return [
            // Generate fake data for the columns
            'orders_id' => \App\Models\Order::factory(),  // Foreign key to the Order table
            'products_id' => \App\Models\Product::factory(),  // Foreign key to the Product table
            'quantity' => $this->faker->numberBetween(1, 10),
            'total_amount' => $this->faker->randomFloat(2, 5, 100),
        ];
    }
}

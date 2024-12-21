<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stock' => $this->faker->numberBetween(10, 500), // Random stock between 10 and 500 units
            'last_updated' => $this->faker->dateTimeThisYear(), // Random last updated date within this year
            'weight_per_unit' => $this->faker->randomFloat(2, 0.5, 10), // Random weight per unit between 0.5 and 10 kg
            'products_id' => Product::factory(), // Associate with a random product using the Product factory
            'warehouses_id' => Warehouse::factory(), // Associate with a random warehouse using the Warehouse factory
        ];
    }
}

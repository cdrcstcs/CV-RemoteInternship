<?php

namespace Database\Factories;

use App\Models\Warehouse;
use App\Models\User; // Import the User model to associate a user with the warehouse
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'warehouse_name' => $this->faker->company . ' Warehouse', // Generate a warehouse name
            'location' => $this->faker->address, // Generate a random address for the location
            'capacity' => $this->faker->numberBetween(100, 10000), // Random capacity between 100 and 10,000
            'available_space' => $this->faker->numberBetween(0, 10000), // Random available space
            'users_id' => User::factory(), // Associate a user with the warehouse (create a new user if needed)
        ];
    }

    /**
     * Indicate that the warehouse has low available space.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function lowSpace(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_space' => $this->faker->numberBetween(0, 500), // Low available space
        ]);
    }

    /**
     * Indicate that the warehouse has high available space.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function highSpace(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_space' => $this->faker->numberBetween(5000, 10000), // High available space
        ]);
    }
}

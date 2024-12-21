<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\Provider;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShipmentFactory extends Factory
{
    protected $model = Shipment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(['Pending', 'Shipped', 'In Transit', 'Delivered', 'Returned']), // Random shipment status
            'estimated_arrival' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Estimated arrival date (within the next month)
            'actual_arrival' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Actual arrival date (within the next month)
            'origin' => $this->faker->city, // Random origin city
            'destination' => $this->faker->city, // Random destination city
            'shipment_method' => $this->faker->randomElement(['Air', 'Sea', 'Land', 'Courier']), // Random shipment method
            'tracking_number' => $this->faker->regexify('[A-Z0-9]{10}'), // Random tracking number (e.g., ABC1234567)
            'last_updated' => $this->faker->dateTimeThisMonth(), // Last update date within the current month
            'total_amount' => $this->faker->randomFloat(2, 10, 500), // Total shipment cost (random between 10 and 500)
            'providers_id' => Provider::factory(), // Associate a provider using the Provider factory
            'orders_id' => Order::factory(), // Associate an order using the Order factory
        ];
    }

    /**
     * Indicate that the shipment is delivered.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Delivered',
            'actual_arrival' => now(), // Set actual arrival to now
        ]);
    }

    /**
     * Indicate that the shipment is in transit.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inTransit(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'In Transit',
            'actual_arrival' => null, // No actual arrival yet
        ]);
    }

    /**
     * Indicate that the shipment is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Pending',
            'actual_arrival' => null, // No actual arrival yet
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Route;
use App\Models\Shipment;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RouteFactory extends Factory
{
    protected $model = Route::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'route_name' => $this->faker->word() . ' Route', // Random route name, e.g., "East Coast Route"
            'start_location' => $this->faker->city, // Random city as the start location
            'end_location' => $this->faker->city, // Random city as the end location
            'estimated_time' => $this->faker->time('H:i'), // Random estimated time for the route
            'distance' => $this->faker->numberBetween(50, 1000), // Random distance between 50 and 1000 km
            'route_type' => $this->faker->randomElement(['Highway', 'Local', 'Expressway', 'Rural']), // Random route type
            'traffic_condition' => $this->faker->randomElement(['Clear', 'Moderate', 'Heavy', 'Congested']), // Random traffic condition
            'route_status' => $this->faker->randomElement(['Active', 'Inactive', 'Under Construction']), // Random route status
            'last_optimized' => $this->faker->dateTimeThisYear(), // Random last optimization date this year
            'shipments_id' => Shipment::factory(), // Associate a shipment using the Shipment factory
            'vehicles_id' => Vehicle::factory(), // Associate a vehicle using the Vehicle factory
        ];
    }

    /**
     * Indicate that the route is inactive.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'route_status' => 'Inactive', // Set status to 'Inactive'
            'last_optimized' => null, // No optimization date
        ]);
    }

    /**
     * Indicate that the route is active.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'route_status' => 'Active', // Set status to 'Active'
            'last_optimized' => $this->faker->dateTimeThisYear(), // Random optimization date within this year
        ]);
    }

    /**
     * Indicate that the route is under construction.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function underConstruction(): static
    {
        return $this->state(fn (array $attributes) => [
            'route_status' => 'Under Construction', // Set status to 'Under Construction'
            'last_optimized' => null, // No optimization date
        ]);
    }
}

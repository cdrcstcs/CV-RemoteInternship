<?php

namespace Database\Factories;

use App\Models\Vehicle;
use App\Models\User;
use App\Models\VehicleManagement;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'license_plate' => $this->faker->regexify('[A-Z]{3}-[0-9]{3}'), // Random license plate (e.g., ABC-123)
            'type' => $this->faker->randomElement(['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle']), // Random vehicle type
            'driver_id' => User::factory(), // Associate a user (driver)
            'capacity' => $this->faker->numberBetween(2, 20), // Random passenger capacity between 2 and 20
            'fuel_capacity' => $this->faker->numberBetween(30, 200), // Random fuel capacity between 30 and 200 liters
            'current_location' => $this->faker->address, // Random location
            'last_serviced' => $this->faker->dateTimeThisYear(), // Random last serviced date this year
            'status' => $this->faker->randomElement(['Active', 'Inactive', 'Under Maintenance']), // Random status
            'last_fuel_refill' => $this->faker->dateTimeThisYear(), // Random date of last fuel refill this year
            'last_location_update' => $this->faker->dateTimeThisYear(), // Random date for last location update
            'mileage' => $this->faker->numberBetween(1000, 200000), // Random mileage (between 1,000 and 200,000 km)
            'maintenance_logs' => $this->faker->text(100), // Random maintenance logs (brief text)
            'vehicle_management_id' => VehicleManagement::factory(), // Associate a vehicle management record
        ];
    }

    /**
     * Indicate that the vehicle is under maintenance.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function underMaintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Under Maintenance',
            'last_serviced' => null, // No last serviced date
            'maintenance_logs' => 'Vehicle is under maintenance.',
        ]);
    }

    /**
     * Indicate that the vehicle is active.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
            'last_serviced' => $this->faker->dateTimeThisYear(),
            'maintenance_logs' => 'Vehicle is in good condition.',
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\VehicleManagement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VehicleManagementFactory extends Factory
{
    protected $model = VehicleManagement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'location_history' => $this->faker->address, // Random location
            'fuel_consumption' => $this->faker->numberBetween(5, 20), // Random fuel consumption (L per 100km)
            'distance_traveled' => $this->faker->numberBetween(1000, 100000), // Random distance traveled in km
            'maintenance_status' => $this->faker->randomElement(['Pending', 'Completed', 'In Progress']), // Random maintenance status
            'last_maintenance_date' => $this->faker->dateTimeThisYear(), // Random date for last maintenance
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 year'), // Random next maintenance date
            'users_id' => User::factory(), // Associate a user with the vehicle (create a new user if needed)
        ];
    }

    /**
     * Indicate that the vehicle's maintenance is completed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenanceCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'maintenance_status' => 'Completed',
            'last_maintenance_date' => now(), // Set last maintenance date to now
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 year'), // Random next maintenance date
        ]);
    }

    /**
     * Indicate that the vehicle's maintenance is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenancePending(): static
    {
        return $this->state(fn (array $attributes) => [
            'maintenance_status' => 'Pending',
            'last_maintenance_date' => null, // No maintenance yet
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Random future maintenance schedule
        ]);
    }

    /**
     * Indicate that the vehicle's maintenance is in progress.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenanceInProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'maintenance_status' => 'In Progress',
            'last_maintenance_date' => $this->faker->dateTimeThisMonth(), // Last maintenance within this month
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Random future maintenance schedule
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\LocationHistory;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LocationHistoryFactory extends Factory
{
    protected $model = LocationHistory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(), // Associate a random vehicle
            'location' => $this->faker->address, // Random address
            'latitude' => $this->faker->latitude(), // Random latitude
            'longitude' => $this->faker->longitude(), // Random longitude
            'timestamp' => $this->faker->dateTimeThisYear(), // Random timestamp this year
        ];
    }

    /**
     * Indicate a custom timestamp.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function customTimestamp($timestamp): static
    {
        return $this->state(fn (array $attributes) => [
            'timestamp' => $timestamp,
        ]);
    }

    /**
     * Indicate the location is in a specific city.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inCity(string $city): static
    {
        return $this->state(fn (array $attributes) => [
            'location' => $city,
            'latitude' => $this->faker->latitude(40, 45), // Latitude for city range
            'longitude' => $this->faker->longitude(-75, -70), // Longitude for city range
        ]);
    }
}

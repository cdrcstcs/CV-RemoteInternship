<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderFactory extends Factory
{
    protected $model = Provider::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['Shipping', 'Storage', 'Logistics', 'Packaging']), // Random provider type
            'terms_of_service' => $this->faker->paragraph, // Random terms of service text
        ];
    }
}

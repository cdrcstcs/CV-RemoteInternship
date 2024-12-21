<?php

namespace Database\Factories;

use App\Models\Rating;
use App\Models\Shipment;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class RatingFactory extends Factory
{
    protected $model = Rating::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rating_value' => $this->faker->numberBetween(1, 5), // Random rating value between 1 and 5
            'feedback' => $this->faker->sentence, // Random feedback comment
            'date_created' => $this->faker->dateTimeThisYear(), // Random date within this year
            'shipments_id' => Shipment::factory(), // Associate a shipment using the Shipment factory
            'products_id' => Product::factory(), // Associate a product using the Product factory
        ];
    }

    /**
     * Indicate that the rating is for a highly rated product.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function highlyRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating_value' => 5, // Set rating to 5
            'feedback' => 'Excellent product!', // Customize feedback for highly rated products
        ]);
    }

    /**
     * Indicate that the rating is for a low-rated product.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function lowRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating_value' => 1, // Set rating to 1
            'feedback' => 'Very poor quality.', // Customize feedback for low-rated products
        ]);
    }
}

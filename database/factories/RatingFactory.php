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
        // List of realistic feedback comments often found in e-commerce reviews
        $feedbacks = [
            'I am very satisfied with this product. It works as expected and is of good quality.',
            'Great value for the money! The product is exactly as described, and it arrived on time.',
            'Not bad, but the product could be improved in certain areas. It does the job, but I expected more.',
            'Disappointing. The quality did not meet my expectations, and it didn\'t work as I hoped.',
            'Terrible! This product broke within a few days of use. Would not recommend.',
            'Fantastic! Exceeded my expectations. Will definitely buy from this seller again.',
            'The product is decent but had some issues with the setup. Customer service was helpful though.',
            'Perfect fit for what I needed! Very easy to use and good build quality.',
            'Very poor quality. It broke after a week, and I couldn’t get a refund.',
            'The product is fine, but the shipping took longer than expected, which was frustrating.'
        ];

        return [
            'rating_value' => $this->faker->numberBetween(1, 5), // Random rating value between 1 and 5
            'feedback' => $this->faker->randomElement($feedbacks), // Randomly select a realistic feedback comment
            'date_created' => $this->faker->dateTimeBetween('-1 year', 'now'), // Random date within the last year
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
            'feedback' => 'Excellent product! Highly recommended to everyone.',
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
            'feedback' => 'Very poor quality. It broke after a few uses, not worth the price.',
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'discount' => $this->faker->numberBetween(5, 50), // Random discount percentage between 5 and 50
            'expiration_date' => $this->faker->dateTimeBetween('now', '+1 year'), // Random expiration date within the next year
        ];
    }
}

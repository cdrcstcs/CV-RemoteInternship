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
            'code' => $this->faker->unique()->lexify('COUPON-??????'), // Random coupon code with a prefix 'COUPON-'
            'discount' => $this->faker->numberBetween(5, 50), // Random discount percentage between 5 and 50
            'expiration_date' => $this->faker->dateTimeBetween('now', '+1 year'), // Random expiration date within the next year
            'is_active' => $this->faker->boolean(), // Randomly decide if the coupon is active or not
        ];
    }
}

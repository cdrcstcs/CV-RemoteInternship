<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(['pending', 'shipped', 'delivered', 'cancelled']), // Random status
            'order_date' => $this->faker->dateTimeThisYear(), // Random date within this year
            'user_id' => User::factory(), // Associate with a user using the User factory
            'tracking_number' => $this->faker->unique()->numerify('TRACK-#######'), // Random tracking number
            'total_amount' => $this->faker->randomFloat(2, 10, 500), // Random total amount between 10 and 500
        ];
    }
}

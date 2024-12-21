<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Order;
use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'total_amount' => $this->faker->randomFloat(2, 50, 1000), // Total amount between 50 and 1000
            'paid_amount' => $this->faker->randomFloat(2, 0, 1000), // Paid amount, up to total amount
            'due_amount' => function (array $attributes) {
                return max(0, $attributes['total_amount'] - $attributes['paid_amount']);
            },
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'bank_transfer', 'cash']),
            'payment_status' => $this->faker->randomElement(['pending', 'completed', 'failed', 'refunded']),
            'payment_date' => $this->faker->dateTimeThisYear(), // Random date within this year
            'gateway' => $this->faker->company, // Random company name as the payment gateway
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP', 'INR']), // Random currency
            'order_id' => Order::factory(), // Associate with an order using the Order factory
            'providers_id' => Provider::factory(), // Associate with a provider using the Provider factory
        ];
    }
}

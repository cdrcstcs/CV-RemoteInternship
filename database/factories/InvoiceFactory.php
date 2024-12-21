<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_name' => $this->faker->name(), // Random customer name
            'created_date' => $this->faker->dateTimeThisYear(), // Random date within this year
            'payment_status' => $this->faker->randomElement(['paid', 'unpaid', 'pending']), // Random payment status
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'bank_transfer']), // Random payment method
            'description' => $this->faker->sentence(), // Random description
            'shipping_cost' => $this->faker->randomFloat(2, 5, 50), // Random shipping cost between 5 and 50
            'total_amount' => $this->faker->randomFloat(2, 50, 500), // Random total amount between 50 and 500
            'paid_amount' => $this->faker->randomFloat(2, 10, 500), // Random paid amount between 10 and 500
            'due_amount' => $this->faker->randomFloat(2, 0, 500), // Random due amount between 0 and 500
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP']), // Random currency
            'discount' => $this->faker->randomFloat(2, 0, 50), // Random discount between 0 and 50
            'payments_id' => Payment::factory(), // Associate with a payment using the Payment factory
        ];
    }
}

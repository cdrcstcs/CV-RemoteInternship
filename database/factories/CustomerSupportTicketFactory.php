<?php

namespace Database\Factories;

use App\Models\CustomerSupportTicket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerSupportTicketFactory extends Factory
{
    protected $model = CustomerSupportTicket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Associate with a random user who created the ticket
            'issue_type' => $this->faker->randomElement(['technical', 'billing', 'general']), // Random issue type
            'description' => $this->faker->paragraph(), // Random description of the issue
            'status' => $this->faker->randomElement(['open', 'closed', 'pending', 'resolved']), // Random status
            'assigned_to' => User::factory(), // Associate with a random user who is assigned the ticket
            'answer' => $this->faker->paragraph(), // Random answer (might be empty for new tickets)
        ];
    }
}

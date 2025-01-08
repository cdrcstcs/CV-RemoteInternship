<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // List of roles with their corresponding descriptions
        $roles = [
            'Administration' => 'Responsible for overseeing all administrative functions and ensuring the organization runs smoothly.',
            'WarehouseManager' => 'Manages the daily operations of the warehouse, including inventory, shipping, and staff management.',
            'DeliveryDriver' => 'Ensures timely and accurate delivery of goods to customers, adhering to delivery schedules.',
            'Customer' => 'A client or individual who purchases or uses the services offered by the company.',
            'CustomerSupportStaff' => 'Provides assistance to customers by addressing inquiries, complaints, and service-related issues.',
            'FinanceManager' => 'Oversees financial operations, budgeting, and reporting to ensure the company’s financial health.',
            'ProductSaler' => 'Create product posts, sale products, delete products',
            'VehicleManager' => 'Manage Vehicle Maintenance',
            'ShipmentManager' => 'Manage and schedule shipment for orders',
        ];


        // Select a random role and its corresponding description
        $role_name = $this->faker->randomElement(array_keys($roles));
        $description = $roles[$role_name];

        return [
            'role_name' => $role_name,
            'description' => $description,
        ];
    }
}

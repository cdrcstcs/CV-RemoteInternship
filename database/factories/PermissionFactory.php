<?php
namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined set of real permissions for an e-commerce platform
        $permissions = [
            'view_products' => 'View products on the platform.',
            'create_product' => 'Add new products to the store.',
            'update_product' => 'Edit existing product details.',
            'delete_product' => 'Remove products from the store.',
            'manage_orders' => 'View and manage customer orders.',
            'process_refunds' => 'Handle refund requests and payments.',
            'view_customers' => 'View the list of customers.',
            'update_customer' => 'Edit customer details like address and contact.',
            'delete_customer' => 'Remove customer accounts.',
            'manage_discounts' => 'Create and manage discount codes for customers.',
            'view_reports' => 'View sales, inventory, and other reports.',
            'manage_inventory' => 'Update stock levels for products.',
            'manage_categories' => 'Add, update, or delete product categories.',
            'manage_shipping' => 'Configure and manage shipping options.',
            'manage_payments' => 'Set up and configure payment methods.',
            'manage_reviews' => 'Approve or remove customer product reviews.',
            'manage_admins' => 'Create and manage administrator accounts.',
            'view_admin_dashboard' => 'Access the admin dashboard for monitoring activities.',
        ];

        // Randomly pick a permission and its description from the predefined list
        $permission = $this->faker->randomElement(array_keys($permissions));
        $description = $permissions[$permission];

        return [
            'permission_name' => $permission, // Real permission name, e.g., 'view_products'
            'description' => $description,    // Real description, e.g., 'View products on the platform.'
        ];
    }
}

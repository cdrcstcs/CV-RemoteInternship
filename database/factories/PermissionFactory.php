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
        return [
            'permission_name' => '',
            'description' => '',
        ];
    }

    /**
     * Return all predefined permissions for the application.
     *
     * @return array<int, array{permission_name: string, description: string}>
     */
    public static function allPermissions(): array
    {
        return [
            // -----------------------
            // 1. Administration
            // -----------------------
            ['permission_name' => 'Manage Users', 'description' => 'Full access to user management: view and update profiles, change passwords, set language preferences.'],
            ['permission_name' => 'Manage Products', 'description' => 'Full control over products: create, update, delete, and manage featured status.'],
            ['permission_name' => 'Manage Inventory', 'description' => 'Full warehouse and inventory management: view, update, create, analyze inventory; manage orders, expenses; process license plates.'],
            ['permission_name' => 'Manage Vehicles', 'description' => 'Full vehicle and delivery management: manage vehicles, assign routes, monitor shipments.'],
            ['permission_name' => 'Manage Cart Coupons Payments', 'description' => 'Full cart, coupon, and payment management: process payments, manage coupons, handle delivery preparation.'],
            ['permission_name' => 'Manage Social Messaging', 'description' => 'Full social and messaging management: connections, notifications, posts, groups, chat, chatbot, emails.'],
            ['permission_name' => 'Manage Live Streaming', 'description' => 'Full live streaming and LiveKit management: create streams, manage viewers, send messages, manage access tokens.'],
            ['permission_name' => 'Manage Media Editor Tools', 'description' => 'Full media and editor tools access: image/video editing, background manipulation, transcription, uploads.'],
            ['permission_name' => 'Manage Two Factor Authentication', 'description' => 'Two-factor authentication management.'],

            // -----------------------
            // 2. Warehouse Manager
            // -----------------------
            ['permission_name' => 'Warehouse Manage Inventory', 'description' => 'Access all warehouse and inventory management functionalities: view, create, update inventories, track orders, manage expenses, process license plates.'],
            ['permission_name' => 'Warehouse Limited User Management', 'description' => 'Limited access to user profile management.'],

            // -----------------------
            // 3. Vehicle Manager
            // -----------------------
            ['permission_name' => 'Vehicle Manage', 'description' => 'Manage vehicles: view and update vehicles with management details.'],

            // -----------------------
            // 4. Delivery Man / Driver
            // -----------------------
            ['permission_name' => 'Delivery View Shipments', 'description' => 'Access shipments: view shipment details and assigned vehicle.'],
            ['permission_name' => 'Delivery Manage Routes', 'description' => 'Can manage route assignments for deliveries.'],

            // -----------------------
            // 5. Customer
            // -----------------------
            ['permission_name' => 'Customer Manage Profile', 'description' => 'Manage personal profile and addresses.'],
            ['permission_name' => 'Customer Manage Cart Payments Coupons', 'description' => 'Manage cart, payments, and coupons.'],
            ['permission_name' => 'Customer View Products', 'description' => 'Access to view products, ratings, and recommendations.'],
            ['permission_name' => 'Customer Social Features', 'description' => 'Participate in social features: posts, comments, likes, connections, notifications, block/follow.'],
            ['permission_name' => 'Customer Messaging Chatbot', 'description' => 'Access messaging and chatbot interactions.'],
            ['permission_name' => 'Customer Live Stream', 'description' => 'Participate in live streaming: own streams, view streams, receive viewer tokens.'],
            ['permission_name' => 'Customer Media Tools', 'description' => 'Access basic media and editor tools for personal use.'],

            // -----------------------
            // 6. ProductSaler
            // -----------------------
            ['permission_name' => 'Productsaler Feedback Forms', 'description' => 'Manage feedback forms for orders.'],
            ['permission_name' => 'Productsaler Manage Coupons Visibility', 'description' => 'Manage coupons and assist in product visibility.'],

            // -----------------------
            // 7. Customer Support Staff
            // -----------------------
            ['permission_name' => 'Support Read Products', 'description' => 'Read access to products.'],
            ['permission_name' => 'Support Read Ratings', 'description' => 'Read access to ratings.'],
            ['permission_name' => 'Support Read Posts', 'description' => 'Read access to posts.'],
            ['permission_name' => 'Support Read Social', 'description' => 'Read access to social connections and notifications.'],
        ];
    }
    /**
     * Return permissions suitable for a given role
     */
    public static function permissionsForRole(string $roleName): array
    {
        $all = self::allPermissions();

        return match ($roleName) {
            'Administration' => $all, // Admin gets all
            'WarehouseManager' => array_filter($all, fn($p) => str_contains($p['permission_name'], 'Warehouse') || str_contains($p['permission_name'], 'Manage Profile')),
            'VehicleManager' => array_filter($all, fn($p) => str_contains($p['permission_name'], 'Vehicle')),
            'DeliveryDriver', 'DeliveryMan' => array_filter($all, fn($p) => str_contains($p['permission_name'], 'Delivery')),
            'Customer' => array_filter($all, fn($p) => str_starts_with($p['permission_name'], 'Customer')),
            'ProductSaler' => array_filter($all, fn($p) => str_starts_with($p['permission_name'], 'Customer') || str_contains($p['permission_name'], 'Productsaler')),
            'CustomerSupportStaff' => array_filter($all, fn($p) => str_starts_with($p['permission_name'], 'Support')),
            default => [],
        };
    }
}

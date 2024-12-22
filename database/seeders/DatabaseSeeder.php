<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    User,
    Role,
    Permission,
    Warehouse,
    VehicleManagement,
    Vehicle,
    Shipment,
    Route,
    Category,
    Product,
    Coupon,
    Invoice,
    Inventory,
    CustomerSupportTicket,
    Payment,
    Order,
    OrderItem,
    Provider,
    Rating,
    ProductCategory,
    ProductCoupon,
    RolePermission,
    UserCoupon,
    UserRole,
};

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Seed Users
        User::factory(10)->create();  // Example: Create 10 users

        // Seed Roles
        Role::factory(5)->create(); // Example: Create 5 roles

        // Seed Permissions
        Permission::factory(5)->create(); // Example: Create 5 permissions

        // Seed Warehouses
        Warehouse::factory(5)->create(); // Example: Create 5 warehouses

        // Seed Vehicle Management
        VehicleManagement::factory(5)->create(); // Example: Create 5 vehicle management entries

        // Seed Vehicles
        Vehicle::factory(5)->create(); // Example: Create 5 vehicles

        // Seed Shipments
        Shipment::factory(10)->create(); // Example: Create 10 shipments

        // Seed Routes
        Route::factory(10)->create(); // Example: Create 10 routes

        // Seed Categories
        Category::factory(5)->create(); // Example: Create 5 categories

        // Seed Products
        Product::factory(20)->create(); // Example: Create 20 products

        // Seed Coupons
        Coupon::factory(5)->create(); // Example: Create 5 coupons

        // Seed Invoices
        Invoice::factory(10)->create(); // Example: Create 10 invoices

        // Seed Inventory
        Inventory::factory(20)->create(); // Example: Create 20 inventory records

        // Seed Customer Support Tickets
        CustomerSupportTicket::factory(10)->create(); // Example: Create 10 support tickets

        // Seed Payments
        Payment::factory(10)->create(); // Example: Create 10 payments

        // Seed Orders
        Order::factory(10)->create(); // Example: Create 10 orders

        // Seed Order Items
        OrderItem::factory(20)->create(); // Example: Create 20 order items

        // Seed Providers
        Provider::factory(5)->create(); // Example: Create 5 providers

        // Seed Ratings
        Rating::factory(10)->create(); // Example: Create 10 ratings

        ProductCategory::factory(5)->create();
        ProductCoupon::factory(5)->create();
        RolePermission::factory(5)->create();
        UserCoupon::factory(5)->create();
        UserRole::factory(5)->create();
    }
}

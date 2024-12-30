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
        $users = User::factory(10)->create();  // Example: Create 10 users
        $products = Product::factory()->count(10)->create(); // Example: creating 10 products
        foreach ($users as $user) {
            // Create a coupon

            $role = Role::factory()->create(); // Example: Create 5 roles
            UserRole::create([
                'users_id' => $user->id, 
                'roles_id' => $role->id,  
            ]);
            $coupons = Coupon::factory(10)->create();
            foreach($coupons as $coupon) {
                foreach ($products as $product) {    
                    // Link the coupon to the product via the ProductCoupon table
                    ProductCoupon::create([
                        'products_id' => $product->id, // Link to the product
                        'coupons_id' => $coupon->id,   // Link to the coupon
                    ]);
                }
    
                UserCoupon::create([
                    'users_id' => $user->id, // Link to the product
                    'coupons_id' => $coupon->id,   // Link to the coupon
                ]);
            }
            
        }
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


        RolePermission::factory(5)->create();
    }
}

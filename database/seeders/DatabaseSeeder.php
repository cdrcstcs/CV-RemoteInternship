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
        $users = User::factory(20)->create();  // Example: Create 10 users
        
        // Seed 5 Categories
        $categories = Category::factory(5)->create(); // Create 5 categories

        // Seed 20 Products
        $products = Product::factory(20)->create(); // Create 20 products

        // Associate each product with all categories
        foreach ($products as $product) {
            foreach ($categories as $category) {
                ProductCategory::create([
                    'products_id' => $product->id,
                    'categories_id' => $category->id,
                ]);
            }
        }

        // Create Roles and associate them with Users
        foreach ($users as $user) {
            $role = Role::factory()->create();
            UserRole::create([
                'users_id' => $user->id,
                'roles_id' => $role->id,
            ]);

            // Create coupons and associate with products
            $coupons = Coupon::factory(10)->create();
            foreach($coupons as $coupon) {
                foreach ($products as $product) {    
                    ProductCoupon::create([
                        'products_id' => $product->id, 
                        'coupons_id' => $coupon->id,
                    ]);
                }
    
                UserCoupon::create([
                    'users_id' => $user->id, 
                    'coupons_id' => $coupon->id,
                ]);
            }
        }

        // Seed Permissions
        // Permission::factory(5)->create();

        // Seed other tables
        // Warehouse::factory(5)->create();
        // VehicleManagement::factory(5)->create();
        // Vehicle::factory(5)->create();
        // Shipment::factory(10)->create();
        // Route::factory(10)->create();
        // Invoice::factory(10)->create();
        // Inventory::factory(20)->create();
        // CustomerSupportTicket::factory(10)->create();
        // Payment::factory(10)->create();
        // Order::factory(10)->create();
        // OrderItem::factory(20)->create();
        Provider::factory(5)->create();
        // Rating::factory(10)->create();
        
        // Create RolePermission associations
        // RolePermission::factory(5)->create();
    }
}

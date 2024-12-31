<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    User,
    Role,
    Permission,
    Warehouse,
    Inventory,
    Product,
    Category,
    Coupon,
    ProductCategory,
    ProductCoupon,
    UserCoupon,
    UserRole,
    Provider
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
        $users = User::factory(20)->create();  // Create 20 users
        
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

        // Seed Warehouses
        $warehouses = Warehouse::factory(5)->create(); // Create 5 warehouses

        // Get all users with the 'warehousemanager' role
        $warehouseManagers = UserRole::whereHas('role', function ($query) {
            $query->where('role_name', 'warehousemanager');
        })->get();

        // Assign each warehouse manager to a warehouse
        foreach ($warehouseManagers as $index => $userRole) {
            // Get the warehouse manager user
            $user = $userRole->user;

            // If there are still warehouses available to assign
            if (isset($warehouses[$index])) {
                $warehouse = $warehouses[$index]; // Get the warehouse to assign

                // Assign this warehouse to the warehouse manager
                $warehouse->users_id = $user->id;
                $warehouse->save(); // Save the warehouse with the assigned warehouse manager
            }
        }

        // Create Inventories for each Warehouse
        foreach ($warehouses as $warehouse) {
            // Create 20 inventories for each warehouse
            $inventories = Inventory::factory(20)->create([
                'warehouses_id' => $warehouse->id, // Associate inventories with the warehouse
            ]);

            // Ensure that each inventory has exactly one unique product
            foreach ($inventories as $index => $inventory) {
                // Attach one unique product to this inventory
                $product = $products[$index]; // Pick a unique product for this inventory
                $inventory->products_id = $product->id;  // Correcting the reference to the $product variable
                $inventory->save(); // Save the inventory with the assigned product
            }
        }

        // Create Providers
        Provider::factory(5)->create();
        
        // Optionally create other relationships or seed additional tables
        // Permission::factory(5)->create();
        // RolePermission::factory(5)->create();
    }
}

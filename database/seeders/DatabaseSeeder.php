<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    User,
    Role,
    Warehouse,
    Inventory,
    Product,
    Category,
    Coupon,
    ProductCategory,
    ProductCoupon,
    UserCoupon,
    UserRole,
    Provider,
    Rating,
    OrderItem,
    Order,
    Shipment,
    Route,
    Vehicle,
    VehicleManagement,
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
        // Seed Categories
        $categories = Category::factory(5)->create(); // Create 5 categories
        
        // Seed Products and associate each with categories
        $products = Product::factory(20)->create(); // Create 20 products
        foreach ($products as $product) {
            // Associate each product with all categories
            foreach ($categories as $category) {
                ProductCategory::create([
                    'products_id' => $product->id,
                    'categories_id' => $category->id,
                ]);
            }

            // Create 5 ratings for each product
            Rating::factory(5)->create([
                'products_id' => $product->id, 
            ]);
        }

        // Seed Users and their roles
        $users = User::factory(20)->create();  // Create 20 users
        foreach ($users as $user) {
            $role = Role::factory()->create();
            UserRole::create([
                'users_id' => $user->id,
                'roles_id' => $role->id,
            ]);
        }

        // Create Coupons and associate with products and users
        $coupons = Coupon::factory(10)->create();
        foreach ($coupons as $index => $coupon) {
            foreach ($products as $productIndex => $product) {
                ProductCoupon::create([
                    'products_id' => $product->id, 
                    'coupons_id' => $coupon->id,
                ]);
            }

            // Instead of random, use a deterministic approach to assign a user
            $userIndex = $index % count($users);  // Cycle through users
            UserCoupon::create([
                'users_id' => $users[$userIndex]->id, 
                'coupons_id' => $coupon->id,
            ]);
        }

        // Seed Warehouses and associate warehouse managers
        $warehouses = Warehouse::factory(20)->create(); // Create 5 warehouses
        foreach ($warehouses as $warehouse) {
            // Get a warehouse manager role user (if exists)
            $warehouseManager = UserRole::whereHas('role', function ($query) {
                $query->where('role_name', 'warehousemanager');
            })->first();

            if ($warehouseManager) {
                $warehouse->users_id = $warehouseManager->user->id;
                $warehouse->save();
            }
        }

        // Create Inventories for each Warehouse
        foreach ($warehouses as $warehouse) {
            $inventories = Inventory::factory(20)->create([
                'warehouses_id' => $warehouse->id,
            ]);

            // Associate each inventory with a unique product
            foreach ($inventories as $index => $inventory) {
                $inventory->products_id = $products[$index % count($products)]->id;
                $inventory->save();
            }
        }

        // Seed Providers
        $providers = Provider::factory(5)->create();

        // Seed Orders with OrderItems
        foreach (range(1, 20) as $i) {
            // Create an Order
            $order = Order::factory()->create();

            // Create 3 to 5 OrderItems per Order (linked to products)
            foreach (range(1, rand(3, 5)) as $j) {
                // Use sequential product selection for order items
                $product = $products[$j % count($products)];  // Ensure wrapping if there are fewer products than order items

                // Create the OrderItem
                OrderItem::factory()->create([
                    'orders_id' => $order->id,
                    'products_id' => $product->id,
                    'total_amount' => $product->price,  // Assuming price exists on product
                    'quantity' => rand(1, 10),
                ]);
            }
        }

        // Seed Shipments for each Order
        foreach (Order::all() as $order) {
            // Create a Shipment for each Order
            $shipment = Shipment::factory()->create([
                'orders_id' => $order->id,
            ]);

            // Assign deterministic shipment status
            $shipment->status = ['Pending', 'Shipped', 'Delivered'][$order->id % 3];  // Cycle through statuses
            $shipment->save();
        }

        // Seed Routes for each Shipment
        foreach (Shipment::all() as $shipment) {
            // Create a Route for each Shipment
            $route = Route::factory()->create([
                'shipments_id' => $shipment->id,
            ]);

            // Assign deterministic route status
            $route->route_status = ['Active', 'Inactive'][$shipment->id % 2];  // Alternate between Active and Inactive
            $route->save();
        }

        // Seed Vehicles and associate with Routes
        foreach (Route::all() as $route) {
            // Create a Vehicle
            $vehicle = Vehicle::factory()->create();

            // Assign deterministic vehicle status
            $vehicle->status = ['Active', 'Under Maintenance'][$route->id % 2];  // Alternate between statuses
            $vehicle->save();

            // Now associate the vehicle with the route (since Route has `vehicles_id`)
            $route->vehicles_id = $vehicle->id;
            $route->save();

            // Create Vehicle Management for each Vehicle
            $vehicleManagement = VehicleManagement::factory()->create([
                'users_id' => User::inRandomOrder()->first()->id, // Assign a random user
            ]);

            // Assign deterministic maintenance status
            $vehicleManagement->maintenance_status = ['Pending', 'Completed', 'In Progress'][$vehicle->id % 3];  // Cycle through statuses
            $vehicleManagement->save();

            // Associate vehicle management with the vehicle (since vehicle has `vehicle_management_id`)
            $vehicle->vehicle_management_id = $vehicleManagement->id;
            $vehicle->save();  // Save the vehicle with the correct relationship
        }
    }
}

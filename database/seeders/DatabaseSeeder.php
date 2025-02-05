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
    LocationHistory,
    UserAddress,
    Permission,
    RolePermission,
    Vehicle,
    FeedbackForm,
    FeedbackFormQuestion,
    FeedbackFormAnswer,
    FeedbackFormQuestionAnswer,
    Post,
    Notification,
    ConnectionRequest,
    Comment,
    Like,
    UserConnection,
};

use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::factory(100)->create();  // Create 20 users

        // Seed Users and their roles
        foreach ($users as $user) {
            $role = Role::factory()->create();
            UserRole::create([
                'users_id' => $user->id,
                'roles_id' => $role->id,
            ]);
            RolePermission::factory()->create([
                'roles_id' => $role->id,
            ]);
        }

        // Seed Categories
        $categories = Category::factory(5)->create(); // Create 5 categories
        
        $productSaler = UserRole::whereHas('role', function ($query) {
            $query->where('role_name', 'ProductSaler');
        })->first();

        $products = Product::factory(20)->create([
            'supplier_id' => $productSaler->user->id,
        ]); // Create 20 products
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

        $faker = Faker::create();
        // Seed applications with associated questions and answers
        FeedbackForm::factory()
            ->count(10)
            ->create(['user_id' => $productSaler->user->id])
            ->each(function ($feedbackForm) use ($faker) {
                FeedbackFormQuestion::factory()
                    ->count(10)
                    ->create(['feedback_form_id' => $feedbackForm->id])
                    ->each(function ($question) use ($feedbackForm, $faker) {
                        $answer = FeedbackFormAnswer::factory()->create(['feedback_form_id' => $feedbackForm->id]);
                        FeedbackFormQuestionAnswer::factory()->create([
                            'feedback_form_question_id' => $question->id,
                            'feedback_form_answer_id' => $answer->id,
                            'answer' => $faker->sentence,
                        ]);
                    });
            });

        // Create posts for each user
        $posts = [];
        foreach ($users as $user) {
            $userPosts = Post::factory()->count(3)->create([
                'author_id' => $user->id,
                'content' => 'This is a sample post content for ' . $user->name,
                'image' => $faker->imageUrl(),
            ]);
            $posts = array_merge($posts, $userPosts->toArray());
        }

        // Create user connections
        foreach ($users as $user) {
            $connections = $users->where('id', '!=', $user->id)->random(rand(1, 3));
            foreach ($connections as $connection) {
                UserConnection::factory()->create([
                    'user_id' => $user->id,
                    'connection_id' => $connection->id,
                ]);
            }
        }

        // Create connection requests between users
        foreach ($users as $sender) {
            foreach ($users as $recipient) {
                if ($sender->id !== $recipient->id) {
                    ConnectionRequest::factory()->create([
                        'sender_id' => $sender->id,
                        'recipient_id' => $recipient->id,
                        'status' => $faker->randomElement(['pending', 'accepted']),
                    ]);
                }
            }
        }

        // Create notifications for each user
        foreach ($users as $user) {
            Notification::factory()->count(2)->create([
                'recipient_id' => $user->id,
                'type' => $faker->randomElement(['like', 'comment', 'connectionAccepted']),
                'related_user' => $users->random()->id,
                'related_post' => Post::factory()->create()->id,
            ]);
        }

        // Create comments for each post
        foreach ($posts as $post) {
            $commentCount = rand(1, 5);
            foreach (range(1, $commentCount) as $index) {
                Comment::factory()->create([
                    'post_id' => $post['id'],
                    'user_id' => $users->random()->id,
                    'content' => $faker->sentence,
                ]);
            }
        }

        // Create likes for some posts
        foreach ($posts as $post) {
            $likeCount = rand(1, 5);
            foreach (range(1, $likeCount) as $index) {
                Like::factory()->create([
                    'post_id' => $post['id'],
                    'user_id' => $users->random()->id,
                ]);
            }
        }
        // Create Coupons and associate with products and users
        $coupons = Coupon::factory(10)->create();
        foreach ($users as $user) {
            foreach ($coupons as $coupon) {
                foreach ($products as $product) {
                    // Check if the combination of product and coupon exists
                    $existingProductCoupon = ProductCoupon::where('products_id', $product->id)
                                                          ->where('coupons_id', $coupon->id)
                                                          ->first();
        
                    if (!$existingProductCoupon) {
                        // If the combination does not exist, create a new record
                        ProductCoupon::create([
                            'products_id' => $product->id,
                            'coupons_id' => $coupon->id,
                        ]);
                    }
                }
        
                // Check if the user-coupon relationship exists
                $existingUserCoupon = UserCoupon::where('users_id', $user->id)
                                               ->where('coupons_id', $coupon->id)
                                               ->first();
        
                if (!$existingUserCoupon) {
                    // If the combination does not exist, create a new record
                    UserCoupon::create([
                        'users_id' => $user->id,
                        'coupons_id' => $coupon->id,
                    ]);
                }
            }
        }
        
        
        

        // Seed Warehouses and associate warehouse managers
        $warehouses = Warehouse::factory(20)->create(); // Create 5 warehouses
        foreach ($warehouses as $warehouse) {
            // Get a warehouse manager role user (if exists)
            $warehouseManager = UserRole::whereHas('role', function ($query) {
                $query->where('role_name', 'WarehouseManager');
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

        $allUsers = User::all();

        foreach ($allUsers as $user) {
            UserAddress::factory(5)->create(['users_id' => $user->id]);
        }

        $deliveryMan = UserRole::whereHas('role', function ($query) {
            $query->where('role_name', 'DeliveryMan');
        })->first();

        $vehicles = Vehicle::factory(1)->create(['driver_id' => $deliveryMan->user->id]);

    }
}

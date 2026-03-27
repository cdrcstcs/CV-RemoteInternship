# Combined Factory Files

## ./database/factories/GroupFactory.php
```php
<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined set of group names and descriptions for e-commerce.
        $groupNames = [
            'Electronics',
            'Fashion',
            'Home & Living',
            'Beauty & Personal Care',
            'Sports & Outdoors',
            'Toys & Games',
            'Books & Media',
            'Health & Wellness',
            'Automotive',
            'Food & Groceries'
        ];

        $groupDescriptions = [
            'Explore a wide range of electronics, including the latest gadgets and devices.',
            'Trendy fashion items, clothing, accessories, and shoes for every season.',
            'Furniture, home decor, and appliances to help you create the perfect home.',
            'Top-quality beauty and personal care products to keep you feeling your best.',
            'Everything you need for your outdoor adventures and fitness goals.',
            'Toys, games, and activities for children of all ages.',
            'A vast collection of books, movies, and music to entertain and educate.',
            'Products for your health and well-being, from supplements to fitness equipment.',
            'Car accessories, parts, and tools for maintaining your vehicle.',
            'Fresh food, snacks, and groceries delivered to your doorstep.'
        ];

        return [
            'name' => $this->faker->randomElement($groupNames), // Pick a random group name from the predefined list
            'description' => $this->faker->randomElement($groupDescriptions), // Pick a random description
            'owner_id' => User::inRandomOrder()->first()->id, // Assign a random user as the owner
        ];
    }
}
```


## ./database/factories/FeedbackFormAnswerFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormAnswerFactory extends Factory
{
    protected $model = FeedbackFormAnswer::class;

    public function definition()
    {
        return [
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
            'feedback_form_id' => null, // Set later
        ];
    }
}
```


## ./database/factories/CategoryFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined real category names and descriptions
        $categories = [
            ['category_name' => 'Technology', 'description' => 'Latest advancements in technology and gadgets'],
            ['category_name' => 'Health & Wellness', 'description' => 'Tips and information on staying healthy'],
            ['category_name' => 'Business', 'description' => 'Insights on entrepreneurship and business trends'],
            ['category_name' => 'Education', 'description' => 'Resources and knowledge for personal growth'],
            ['category_name' => 'Fashion', 'description' => 'Trends and styles in the fashion world'],
            // Add more categories as needed
        ];

        // Randomly pick a category from the list
        $category = $categories[array_rand($categories)];

        return [
            'category_name' => $category['category_name'],
            'description' => $category['description'],
        ];
    }
}
```


## ./database/factories/CommentFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition()
    {
        $comments = [
            'This product is amazing! Exactly as described, will definitely buy again.',
            'Great quality and fast shipping, I am very happy with my purchase.',
            'The product didn’t meet my expectations. It arrived damaged.',
            'I love this item! It works perfectly and was easy to use.',
            'Not worth the price, I found a better alternative elsewhere.',
            'Shipping took longer than expected, but the product is great.',
            'Excellent customer service, the seller was very helpful with my inquiries.',
            'I am very satisfied with this purchase, highly recommend it!',
            'It’s okay, but I expected more for the price.',
            'The product is good but has some minor defects.',
        ];

        return [
            'post_id' => Post::factory(), // Creates a new post for the comment
            'user_id' => User::factory(), // Creates a new user for the comment
            'content' => $this->faker->randomElement($comments), // Picks a random comment from the array
        ];
    }
}
```


## ./database/factories/MessageFactory.php
```php
<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Group;

class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined set of real message content related to e-commerce scenarios
        $messages = [
            'Hi, I have a question about the product I ordered. Is it compatible with model XYZ?',
            'My order hasn’t arrived yet. Can you provide an update on the delivery status?',
            'I would like to return an item I purchased. Could you please assist me with the process?',
            'Can you help me track my order? I ordered it over a week ago and haven’t received any updates.',
            'I received the wrong product. Please let me know how to return it.',
            'The quality of the item doesn’t match the description. I would like a refund.',
            'I received my package, but it was damaged. What steps do I need to take for a replacement?',
            'I would like to know when this item will be back in stock. Can you provide any information?',
            'Can you recommend similar products? I’m not satisfied with my current purchase.',
            'Thank you for the fast shipping! I’m very happy with the product.',
            'I love this product! It’s exactly what I was looking for.',
            'How can I change my shipping address for an existing order?',
            'Is there any way to expedite my order? I need it urgently.',
            'Do you have a size guide for your clothing? I’m unsure about which size to select.',
            'I’m not able to apply my discount code. Could you assist with that?',
            'Can I cancel my order? I made a mistake while ordering.',
            'The product was great, but I didn’t like the packaging. Can you improve it?',
        ];

        // Randomly pick a message from the predefined list
        $messageContent = $this->faker->randomElement($messages);

        // Logic for determining sender and receiver, or group
        $senderId = $this->faker->randomElement([0, 1]);
        if ($senderId === 0) {
            $senderId = $this->faker
                ->randomElement(User::where('id', '!=', 1)
                    ->pluck('id')->toArray());
            $receiverId = 1;
        } else {
            $receiverId = $this->faker->randomElement(User::pluck('id')->toArray());
        }

        $groupId = null;
        if ($this->faker->boolean(50)) {
            $groupId = $this->faker->randomElement(Group::pluck('id')->toArray());
            // Select group by group_id
            $group = Group::find($groupId);
            $senderId = $this->faker->randomElement($group->users->pluck('id')->toArray());
            $receiverId = null;
        }

        return [
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
            'message' => $messageContent,  // Using the real message content
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
```


## ./database/factories/VehicleManagementFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\VehicleManagement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VehicleManagementFactory extends Factory
{
    protected $model = VehicleManagement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fuel_consumption' => $this->faker->numberBetween(5, 20), // Random fuel consumption (L per 100km)
            'distance_traveled' => $this->faker->numberBetween(1000, 100000), // Random distance traveled in km
            'maintenance_status' => $this->faker->randomElement(['Pending', 'Completed', 'In Progress']), // Random maintenance status
            'last_maintenance_date' => $this->faker->dateTimeThisYear(), // Random date for last maintenance
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 year'), // Random next maintenance date
            'maintenance_cost' => $this->faker->numberBetween(5, 20), // Random fuel consumption (L per 100km)
            'users_id' => User::factory(), // Associate a user with the vehicle (create a new user if needed)
        ];
    }

    /**
     * Indicate that the vehicle's maintenance is completed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenanceCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'maintenance_status' => 'Completed',
            'last_maintenance_date' => now(), // Set last maintenance date to now
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 year'), // Random next maintenance date
        ]);
    }

    /**
     * Indicate that the vehicle's maintenance is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenancePending(): static
    {
        return $this->state(fn (array $attributes) => [
            'maintenance_status' => 'Pending',
            'last_maintenance_date' => null, // No maintenance yet
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Random future maintenance schedule
        ]);
    }

    /**
     * Indicate that the vehicle's maintenance is in progress.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenanceInProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'maintenance_status' => 'In Progress',
            'last_maintenance_date' => $this->faker->dateTimeThisMonth(), // Last maintenance within this month
            'maintenance_schedule' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Random future maintenance schedule
        ]);
    }
}
```


## ./database/factories/InventoryFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stock' => $this->faker->numberBetween(10, 500), // Random stock between 10 and 500 units
            'last_updated' => $this->faker->dateTimeThisYear(), // Random last updated date within this year
            'weight_per_unit' => $this->faker->randomFloat(2, 0.5, 10), // Random weight per unit between 0.5 and 10 kg
            'products_id' => Product::factory(), // Associate with a random product using the Product factory
            'warehouses_id' => Warehouse::factory(), // Associate with a random warehouse using the Warehouse factory
        ];
    }
}
```


## ./database/factories/FeedbackFormQuestionAnswerFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\FeedbackFormQuestionAnswer;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormQuestionAnswerFactory extends Factory
{
    protected $model = FeedbackFormQuestionAnswer::class;

    public function definition()
    {
        // Define possible answers for feedback questions.
        $answers = [
            'Very satisfied with my purchase. Everything was perfect!',
            'Satisfied with the product, but shipping took longer than expected.',
            'The product didn’t match the description. I am disappointed.',
            'The product is good, but the packaging was damaged.',
            'Customer service was excellent, and the product quality is great!',
            'Not satisfied. The item was faulty, and the return process was confusing.',
            'Great value for money, will buy again.',
            'I had issues with the payment process, but the product itself is fine.',
            'The quality of the product exceeded my expectations.',
            'The product was as described, but the delivery service could be better.',
            'Very disappointed, I will not be purchasing again.',
            'The return process was easy, but the product didn’t work for me.',
            'Good product, but I wish there were more color options.',
            'Product was damaged on arrival, very dissatisfied.',
            'The product is okay but not worth the price.',
            'Excellent product and the delivery was very quick!',
            'I am happy with my purchase but had difficulty navigating the website.',
            'The product broke after one use, I want a refund.',
            'Not happy with the customer service response time.',
            'The product is exactly what I was looking for, would recommend.',
        ];

        return [
            'feedback_form_question_id' => FeedbackFormQuestion::factory(), // Create a question if it doesn't exist
            'feedback_form_answer_id' => FeedbackFormAnswer::factory(), // Create an answer if it doesn't exist
            'answer' => $this->faker->randomElement($answers), // Randomly pick an answer from the predefined list
        ];
    }
}
```


## ./database/factories/VehicleFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Vehicle;
use App\Models\User;
use App\Models\VehicleManagement;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'license_plate' => $this->faker->regexify('[A-Z]{3}-[0-9]{3}'), // Random license plate (e.g., ABC-123)
            'type' => $this->faker->randomElement(['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle']), // Random vehicle type
            'driver_id' => User::factory(), // Associate a user (driver)
            'capacity' => $this->faker->numberBetween(2, 20), // Random passenger capacity between 2 and 20
            'fuel_capacity' => $this->faker->numberBetween(30, 200), // Random fuel capacity between 30 and 200 liters
            'current_location' => $this->faker->address, // Random location
            'last_serviced' => $this->faker->dateTimeThisYear(), // Random last serviced date this year
            'status' => $this->faker->randomElement(['Active', 'Inactive', 'Under Maintenance']), // Random status
            'last_fuel_refill' => $this->faker->dateTimeThisYear(), // Random date of last fuel refill this year
            'last_location_update' => $this->faker->dateTimeThisYear(), // Random date for last location update
            'mileage' => $this->faker->numberBetween(1000, 200000), // Random mileage (between 1,000 and 200,000 km)
            'maintenance_logs' => $this->faker->text(100), // Random maintenance logs (brief text)
            'vehicle_management_id' => VehicleManagement::factory(), // Associate a vehicle management record

            // New fields
            'fuel_interval' => $this->faker->numberBetween(0, 1000), // Random fuel interval (e.g., between 0 and 1000 km)
            'fuel_type' => $this->faker->randomElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']), // Random fuel type
            'vin' => $this->faker->bothify('??###??#####????'), // Random VIN (Vehicle Identification Number)

            // New fields for brand, model, and year of manufacture
            'brand' => $this->faker->company, // Random brand (could be any company name)
            'model' => $this->faker->word, // Random model (random word)
            'year_of_manufacture' => $this->faker->year(), // Random year of manufacture (current year or a random one)
        ];
    }

    /**
     * Indicate that the vehicle is under maintenance.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function underMaintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Under Maintenance',
            'last_serviced' => null, // No last serviced date
            'maintenance_logs' => 'Vehicle is under maintenance.',
            'fuel_interval' => 0, // Optionally set to 0 when under maintenance
            'fuel_type' => $this->faker->randomElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']), // Random fuel type
            'vin' => $this->faker->bothify('??###??#####????'), // Random VIN

            // New fields for brand, model, and year of manufacture
            'brand' => $this->faker->company, // Random brand
            'model' => $this->faker->word, // Random model
            'year_of_manufacture' => $this->faker->year(), // Random year of manufacture
        ]);
    }

    /**
     * Indicate that the vehicle is active.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
            'last_serviced' => $this->faker->dateTimeThisYear(),
            'maintenance_logs' => 'Vehicle is in good condition.',
            'fuel_interval' => $this->faker->numberBetween(0, 1000), // Random fuel interval
            'fuel_type' => $this->faker->randomElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']), // Random fuel type
            'vin' => $this->faker->bothify('??###??#####????'), // Random VIN

            // New fields for brand, model, and year of manufacture
            'brand' => $this->faker->company, // Random brand
            'model' => $this->faker->word, // Random model
            'year_of_manufacture' => $this->faker->year(), // Random year of manufacture
        ]);
    }
}
```


## ./database/factories/FeedbackFormQuestionFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\FeedbackFormQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FeedbackFormQuestionFactory extends Factory
{
    protected $model = FeedbackFormQuestion::class;

    // Array mapping questions to their descriptions and answers for an e-commerce platform
    private $feedbackQuestions = [
        'How would you rate the speed of delivery?' => [
            'description' => 'Please provide your feedback on the delivery time and whether it met your expectations.',
            'answers' => [
                'The delivery was quick and arrived ahead of schedule.',
                'The delivery took longer than expected, and I was disappointed.',
                'The delivery was on time, and I am satisfied with the service.',
            ],
        ],
        'How satisfied are you with the condition of the product upon arrival?' => [
            'description' => 'Share your experience with the product’s condition when it was delivered.',
            'answers' => [
                'The product arrived in perfect condition, exactly as described.',
                'The product was damaged during shipping, and I had to return it.',
                'The product was slightly damaged but still usable.',
            ],
        ],
        'How easy was it to place your order on our website?' => [
            'description' => 'Provide feedback on the ease of the ordering process on our website.',
            'answers' => [
                'The website was very easy to navigate, and I had no issues placing my order.',
                'I had some trouble finding the product I wanted and checking out.',
                'The order process was confusing, and I had to contact customer service.',
            ],
        ],
        'Were the product details accurate on the website?' => [
            'description' => 'Tell us whether the product descriptions, images, and specifications matched what you received.',
            'answers' => [
                'The product was exactly as described on the website.',
                'The product did not match the description; I was disappointed with the mismatch.',
                'Some aspects of the product description were inaccurate or unclear.',
            ],
        ],
        'How satisfied are you with the packaging of your order?' => [
            'description' => 'Please share your feedback regarding the packaging of your product.',
            'answers' => [
                'The product was well-packaged and protected during transit.',
                'The packaging was poor, and the product was slightly damaged.',
                'The packaging was sufficient but could have been improved.',
            ],
        ],
        'How would you rate the communication regarding your order status?' => [
            'description' => 'Provide feedback on how well we kept you informed about your order status and any updates.',
            'answers' => [
                'I received timely updates, and I was always informed about my order status.',
                'I did not receive enough communication and had to check manually.',
                'I was not informed about any delays or issues with my order.',
            ],
        ],
        'How satisfied are you with the quality of the product?' => [
            'description' => 'Give feedback on the quality of the product you received.',
            'answers' => [
                'The product exceeded my expectations and was of high quality.',
                'The product was not as expected and felt low quality.',
                'The product was of acceptable quality, but not as good as I had hoped.',
            ],
        ],
        'How likely are you to recommend this product to others?' => [
            'description' => 'Share whether you would recommend this product to friends or family.',
            'answers' => [
                'I would highly recommend this product to others.',
                'I would not recommend this product due to poor quality.',
                'I might recommend this product depending on the needs of the person.',
            ],
        ],
        'Was the product available when you wanted to purchase it?' => [
            'description' => 'Tell us if you were able to find and order the product easily.',
            'answers' => [
                'The product was readily available and I had no issues purchasing it.',
                'The product was out of stock, and I had to wait longer for delivery.',
                'The product was listed but later marked as unavailable.',
            ],
        ],
        'How do you rate the variety of products on our website?' => [
            'description' => 'Provide feedback on the range of products available on our site.',
            'answers' => [
                'There is a wide variety of products, and I found everything I needed.',
                'The product selection was limited, and I could not find what I wanted.',
                'The variety of products is good, but there could be more options.',
            ],
        ],
        'How easy was the return process if your order didn’t meet expectations?' => [
            'description' => 'Share your experience with our return process.',
            'answers' => [
                'The return process was straightforward and quick.',
                'The return process was complicated and took too long.',
                'The return process was acceptable, but it could be improved.',
            ],
        ],
        'How did you find the pricing of the product?' => [
            'description' => 'Tell us if you think the product was priced fairly based on its quality and the competition.',
            'answers' => [
                'The product was priced fairly and matched the quality.',
                'The product was overpriced compared to similar products.',
                'The product was a great deal considering its quality.',
            ],
        ],
        'Did you experience any issues during checkout?' => [
            'description' => 'Please share if you faced any issues while completing your order.',
            'answers' => [
                'The checkout process was smooth and easy.',
                'I encountered some issues during checkout but eventually completed the order.',
                'I had significant issues during checkout and had to contact support.',
            ],
        ],
        'How do you feel about the shipping costs?' => [
            'description' => 'Tell us if you think the shipping fees were reasonable for the service provided.',
            'answers' => [
                'The shipping costs were reasonable for the delivery time and service.',
                'The shipping was too expensive, especially for standard delivery.',
                'I was happy with the free shipping offer and did not mind the price.',
            ],
        ],
        'How would you rate our customer service if you contacted them?' => [
            'description' => 'Provide feedback on any interaction with our customer service team.',
            'answers' => [
                'Customer service was very helpful and resolved my issue quickly.',
                'Customer service was slow to respond and didn’t fully resolve my issue.',
                'I did not need to contact customer service.',
            ],
        ],
        'How would you rate the overall ordering experience on our website?' => [
            'description' => 'Give an overall rating of your experience with our online store.',
            'answers' => [
                'The overall experience was excellent, and I will shop here again.',
                'The experience was okay, but there are a few things that could be improved.',
                'I did not have a good experience and may not shop here again.',
            ],
        ],
        'How satisfied are you with the ease of finding products on our website?' => [
            'description' => 'Please share if you found it easy to search for and find the products you wanted.',
            'answers' => [
                'The website’s search and filters made it easy to find what I was looking for.',
                'The search functionality was okay, but it could be improved.',
                'I had trouble finding what I was looking for on the website.',
            ],
        ],
        'Did the product meet your expectations based on the website images and descriptions?' => [
            'description' => 'Let us know if the product matched your expectations after viewing it online.',
            'answers' => [
                'The product was exactly as shown and described on the website.',
                'The product didn’t match the online description or image.',
                'Some aspects of the product were different from what I expected based on the description.',
            ],
        ],
        'How would you rate your overall satisfaction with the product delivery?' => [
            'description' => 'Please share your thoughts on the overall delivery process.',
            'answers' => [
                'I am very satisfied with the delivery service.',
                'I was dissatisfied with the delivery and had issues with the service.',
                'The delivery was acceptable, but it could be improved.',
            ],
        ],
        'Would you consider purchasing from us again in the future?' => [
            'description' => 'Let us know if you would consider buying from our website again based on this experience.',
            'answers' => [
                'Yes, I will definitely shop here again.',
                'I might consider shopping here again depending on future experiences.',
                'I would not consider shopping here again based on my current experience.',
            ],
        ],
    ];




    public function definition()
    {
        // Randomly select a question and its corresponding description and answers
        $question = $this->faker->randomElement(array_keys($this->feedbackQuestions));
        $description = $this->feedbackQuestions[$question]['description'];
        $answers = $this->feedbackQuestions[$question]['answers'];

        // Randomly decide if 'data' will be text or an options array
        $dataType = $this->faker->randomElement(['text','select', 'radio', 'checkbox','textarea' ]);

        if ($dataType != 'text' && $dataType != 'textarea') {
            // Create options based on the answers for the question
            $options = [
                'options' => array_map(function ($answer) {
                    return [
                        'uuid' => (string) Str::uuid(),
                        'text' => $answer,
                    ];
                }, $answers),
            ];
            $data = json_encode($options); // Encode the array as a JSON string
        } else {
            $data = $this->faker->text; // Simple text (if needed for some questions)
        }

        return [
            'type' => $dataType, // Keep this if you have different types
            'question' => $question, // Random job question
            'description' => $description, // Corresponding job description
            'data' => $data,
            'feedback_form_id' => null, // Set later
        ];
    }
}
```


## ./database/factories/OrderFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(['Paid','Pending', 'Confirmed', 'Packed', 'Delivery Scheduled', 'Delivery Maintenance Checked','On Delivery', 'Delivered']), // Random status
            'order_date' => $this->faker->dateTimeThisYear(), // Random date within this year
            'user_id' => User::factory(), // Associate with a user using the User factory
            'tracking_number' => $this->faker->unique()->numerify('TRACK-#######'), // Random tracking number
            'total_amount' => $this->faker->randomFloat(2, 10, 500), // Random total amount between 10 and 500
        ];
    }
}
```


## ./database/factories/NotificationFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        return [
            'recipient_id' => User::factory(), // Creates a new user for the recipient
            'type' => $this->faker->randomElement(['like', 'comment', 'connectionAccepted']),
            'related_user' => User::factory(),
            'related_post' => Post::factory(),
            'read' => $this->faker->boolean(),
        ];
    }
}
```


## ./database/factories/PostFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    // Predefined image URLs (these could represent products or promotions)
    private static $imageUrls = [
        'https://cdn.thewirecutter.com/wp-content/media/2024/11/runningshoes-2048px-09522.jpg?auto=webp&quality=75&width=1024',
        'https://m.media-amazon.com/images/I/61V98P7+jiL.jpg',
        'https://down-sg.img.susercontent.com/file/2520047a3506c1dc94f41677d129f540',
        'https://cdn.thewirecutter.com/wp-content/media/2024/05/white-sneaker-2048px-9320.jpg?auto=webp&quality=75&crop=1.91:1&width=1200',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzCINXMUbqCfb_MnCjyooBavt2dYK-gVrBQ&s',
        'https://assets.vogue.com/photos/5891e0ebb482c0ea0e4db2a8/4:3/w_2560%2Cc_limit/02-lestrange.jpg',
        'https://i.ebayimg.com/images/g/sTgAAOSwinJk3YuY/s-l1200.jpg',
        'https://marilyn.nz/wp-content/uploads/2021/12/Morilee-Wedding-Dress-5960-Feature.webp'
    ];

    // Predefined content for e-commerce posts, such as product promotions, announcements, or sales
    private static $postContent = [
        'Check out our new arrivals! These sneakers are perfect for your daily runs. Get yours today with 10% off!',
        'Limited time offer: Buy one, get one free on all summer dresses! Don\'t miss out on this amazing deal.',
        'Hurry up! Our biggest sale of the year is happening right now. Get up to 50% off on selected items.',
        'Have you seen our latest collection of kitchen gadgets? They\'re now available at discounted prices!',
        'The best time to upgrade your wardrobe is now. Shop our winter collection and save up to 30%.',
        'Introducing our new smart watch that helps track your health! Get it now with an exclusive discount.',
        'Customer review: "These headphones are amazing! The sound quality is top-notch, and the comfort is unbeatable!"',
        'Our most popular shoes are now back in stock! Get yours before they run out again!',
        'Want to look stylish for less? Don\'t miss out on our Black Friday sale with huge discounts!',
        'We’ve added new products to our beauty collection. Explore the latest skincare items on sale!',
        'Get ready for the holidays with our seasonal promotions! Gift cards are now available for purchase!',
    ];

    public function definition()
    {
        return [
            'author_id' => User::factory(), // Creates a new user for the author (could be a business or admin)
            'content' => $this->getRandomContent(), // Randomly selected real post content
            'image' => $this->getRandomImage(), // Randomly selected image URL
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Post $post) {
            // Create comments for the post
            Comment::factory()
                ->count(3) // Adjust the count as needed
                ->create([
                    'post_id' => $post->id,
                    'user_id' => User::factory(), // Creates a new user for each comment
                ]);

            // Create likes for the post
            $likeCount = 5; // For example, create 5 likes
            for ($i = 0; $i < $likeCount; $i++) {
                Like::factory()->create([
                    'post_id' => $post->id,
                    'user_id' => User::factory(), // Creates a new user for each like
                ]);
            }
        });
    }

    /**
     * Get a random image URL from the collection.
     *
     * @return string
     */
    private function getRandomImage(): string
    {
        // Randomly select an image URL from the collection
        return self::$imageUrls[array_rand(self::$imageUrls)];
    }

    /**
     * Get a random post content from the predefined list.
     *
     * @return string
     */
    private function getRandomContent(): string
    {
        // Randomly select a post content from the predefined list
        return self::$postContent[array_rand(self::$postContent)];
    }
}
```


## ./database/factories/ChatbotFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Chatbot;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChatbotFactory extends Factory
{
    protected $model = Chatbot::class;

    public function definition()
    {
        return [
            'user_id' => 1, // Assigning user_id as 1
            'history' => $this->generateHistory(), // Call the method to generate the history
        ];
    }

    // Helper method to generate the history structure with more consistent and varied data
    private function generateHistory()
    {
        // Predefined patterns for 'user' and 'model' roles
        $history = [
            // Initial greeting
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'Hi, I need help with my account.']
                ],
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'Hello! How can I assist you today?']
                ],
            ],
            // Account-related issue
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'I’m having trouble logging in.']
                ],
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'I see. Are you receiving any error messages?']
                ],
            ],
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'Yes, it says my password is incorrect.']
                ],
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'Got it. Have you tried resetting your password yet?']
                ],
            ],
            // Resetting password flow with a slight variance
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'I tried, but I didn’t get the reset email.']
                ],
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'Hmm, that’s strange. Please check your spam folder.']
                ],
            ],
            // Offering assistance with further issues
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'I checked, and it’s not there. What should I do next?']
                ],
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'I can help you with that. Let me escalate the issue.']
                ],
            ],
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'Thanks for your help!']
                ],
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'You’re welcome! Let me know if you need anything else.']
                ],
            ],
        ];

        return $history; // Return the predefined, varied conversation history
    }
}
```


## ./database/factories/PaymentFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Order;
use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'total_amount' => $this->faker->randomFloat(2, 50, 1000), // Total amount between 50 and 1000
            'paid_amount' => $this->faker->randomFloat(2, 0, 1000), // Paid amount, up to total amount
            'due_amount' => function (array $attributes) {
                return max(0, $attributes['total_amount'] - $attributes['paid_amount']);
            },
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'bank_transfer', 'cash']),
            'payment_status' => $this->faker->randomElement(['pending', 'completed', 'failed', 'refunded']),
            'payment_date' => $this->faker->dateTimeThisYear(), // Random date within this year
            'gateway' => $this->faker->company, // Random company name as the payment gateway
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP', 'INR']), // Random currency
            'order_id' => Order::factory(), // Associate with an order using the Order factory
            'providers_id' => Provider::factory(), // Associate with a provider using the Provider factory
        ];
    }
}
```


## ./database/factories/WarehouseFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\Warehouse;
use App\Models\User; // Import the User model to associate a user with the warehouse
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined list of real warehouse names with unique addresses
        $warehouseAddresses = [
            'Amazon Fulfillment Center' => '2001 7th Ave, Seattle, WA, USA',
            'Walmart Distribution Center' => '8500 W Markham St, Little Rock, AR, USA',
            'FedEx Warehouse' => '123 Main St, Memphis, TN, USA',
            'UPS Supply Chain Solutions' => '1 UPS Way, Louisville, KY, USA',
            'Home Depot Distribution Hub' => '240 Peachtree St, Atlanta, GA, USA',
            'Target Warehouse' => '1000 Nicollet Mall, Minneapolis, MN, USA',
            'Costco Distribution Center' => '999 3rd Ave, Issaquah, WA, USA',
            'Kroger Supply Chain' => '1014 Vine St, Cincinnati, OH, USA',
            'Best Buy Warehouse' => '7601 Penn Ave S, Richfield, MN, USA',
            'Lidl Logistics Hub' => '1 Lidl Blvd, Arlington, VA, USA'
        ];

        // Predefined list of real countries and cities
        // Predefined list of real cities, states, and country codes (ISO3)
        $countriesISO3 = [
            'USA' => 'United States', 'CAN' => 'Canada', 'GBR' => 'United Kingdom', 
            'DEU' => 'Germany', 'FRA' => 'France', 'AUS' => 'Australia', 'IND' => 'India',
            'BRA' => 'Brazil', 'CHN' => 'China', 'JPN' => 'Japan', 'MEX' => 'Mexico',
            'ITA' => 'Italy', 'ESP' => 'Spain', 'RUS' => 'Russia', 'ZAF' => 'South Africa',
            'ARG' => 'Argentina', 'KOR' => 'South Korea', 'SAU' => 'Saudi Arabia',
            'SWE' => 'Sweden', 'NLD' => 'Netherlands', 'BEL' => 'Belgium', 'CHE' => 'Switzerland',
            'DNK' => 'Denmark', 'NOR' => 'Norway', 'FIN' => 'Finland', 'POL' => 'Poland',
            'TUR' => 'Turkey', 'EGY' => 'Egypt', 'ARE' => 'United Arab Emirates', 'GRC' => 'Greece',
            'SGP' => 'Singapore', 'CHL' => 'Chile', 'PER' => 'Peru', 'KSA' => 'Saudi Arabia',
            'IDN' => 'Indonesia', 'PHL' => 'Philippines', 'MYS' => 'Malaysia', 'NZL' => 'New Zealand'
        ];
        
        $cities = [
            'USA' => ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Boston', 'Dallas', 'Seattle', 'Miami'],
            'CAN' => ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Edmonton', 'Quebec City', 'Winnipeg', 'Hamilton', 'Kitchener'],
            'GBR' => ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Sheffield', 'Leeds', 'Cardiff'],
            'DEU' => ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund', 'Leipzig', 'Essen'],
            'FRA' => ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille'],
            'AUS' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Hobart', 'Darwin', 'Newcastle'],
            'IND' => ['New Delhi', 'Mumbai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'],
            'BRA' => ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
            'CHN' => ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Xi’an', 'Nanjing', 'Tianjin', 'Wuhan'],
            'JPN' => ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
            'MEX' => ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún', 'Tijuana', 'Mérida', 'León', 'San Luis Potosí', 'Querétaro'],
            'ITA' => ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Catania'],
            'ESP' => ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Malaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
            'RUS' => ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Samara', 'Omsk', 'Kazan', 'Chelyabinsk', 'Rostov-on-Don'],
            'ZAF' => ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley'],
            'ARG' => ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'],
            'KOR' => ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Suwon', 'Changwon', 'Seongnam'],
            'SAU' => ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Khobar', 'Dammam', 'Tabuk', 'Abha', 'Al Khobar', 'Najran'],
            'SWE' => ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
            'NLD' => ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Almere', 'Breda', 'Leiden', 'Hilversum'],
            'BEL' => ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Leuven', 'Namur', 'Mons', 'Kortrijk'],
            'CHE' => ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lucerne', 'Lausanne', 'St. Moritz', 'Zermatt', 'Interlaken', 'Montreux'],
            'DNK' => ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Herning'],
            'NOR' => ['Oslo', 'Bergen', 'Stavanger', 'Drammen', 'Dundas', 'Trondheim', 'Bodø', 'Tromsø', 'Fredrikstad', 'Porsgrunn'],
            'FIN' => ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
            'POL' => ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
            'TUR' => ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Antalya', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır'],
            'EGY' => ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Mansoura', 'Tanta'],
            'ARE' => ['Abu Dhabi', 'Dubai', 'Sharjah', 'Al Ain', 'Ajman', 'Umm Al-Quwain', 'Fujairah', 'Ras Al Khaimah'],
            'GRC' => ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Ioannina', 'Chania', 'Rhodes', 'Kavala'],
            'SGP' => ['Singapore'],
            'CHL' => ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Iquique', 'Rancagua', 'Arica', 'Talca'],
            'PER' => ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 'Tacna', 'Huancayo', 'Chimbote'],
            'KSA' => ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Khobar', 'Dammam', 'Tabuk', 'Abha', 'Al Khobar', 'Najran'],
            'IDN' => ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Semarang', 'Tangerang', 'Makassar', 'Yogyakarta', 'Palembang'],
            'PHL' => ['Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Makati', 'Cagayan de Oro', 'Taguig', 'Zamboanga City', 'Iloilo City', 'Bacolod'],
            'MYS' => ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Kota Kinabalu', 'Melaka', 'Shah Alam', 'Alor Setar', 'Kuching', 'Miri'],
            'NZL' => ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin', 'Tauranga', 'Napier-Hastings', 'Palmerston North', 'Rotorua', 'Whangarei'],
        ];
        // Ensure that the warehouse names are unique by using array_keys to get the names
        $warehouseNames = array_keys($warehouseAddresses);

        // Randomly select a unique warehouse name and its corresponding unique address
        $warehouseName = array_shift($warehouseNames); // Get the first available name (shift ensures uniqueness)
        $location = $warehouseAddresses[$warehouseName]; // Get the corresponding address

        // Define realistic capacity and available space ranges
        $capacity = rand(1000, 10000);  // Warehouse capacity (1,000 to 10,000 units)
        $availableSpace = rand(0, $capacity);  // Available space within that range

        return [
            'warehouse_name' => $warehouseName, // Unique warehouse name
            'location' => $location, // Unique address for each warehouse name
            'capacity' => $capacity, // Random but realistic capacity
            'available_space' => $availableSpace, // Random available space
            'users_id' => User::factory(), // Associate a user with the warehouse (create a new user if needed)
        ];
    }
}
```


## ./database/factories/RolePermissionFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Database\Eloquent\Factories\Factory;

class RolePermissionFactory extends Factory
{
    protected $model = RolePermission::class;

    public function definition()
    {
        return [
            'roles_id' => Role::factory(),         // Assuming a Role factory exists
            'permissions_id' => Permission::factory(), // Assuming a Permission factory exists
        ];
    }
}
```


## ./database/factories/PermissionFactory.php
```php
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
```


## ./database/factories/ProductCouponFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Coupon;
use App\Models\ProductCoupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCouponFactory extends Factory
{
    protected $model = ProductCoupon::class;

    public function definition()
    {
        return [
            'products_id' => Product::factory(), // Assumes a Product factory exists
            'coupons_id' => Coupon::factory(),   // Assumes a Coupon factory exists
        ];
    }
}
```


## ./database/factories/RatingFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\Rating;
use App\Models\Shipment;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class RatingFactory extends Factory
{
    protected $model = Rating::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // List of realistic feedback comments often found in e-commerce reviews
        $feedbacks = [
            'I am very satisfied with this product. It works as expected and is of good quality.',
            'Great value for the money! The product is exactly as described, and it arrived on time.',
            'Not bad, but the product could be improved in certain areas. It does the job, but I expected more.',
            'Disappointing. The quality did not meet my expectations, and it didn\'t work as I hoped.',
            'Terrible! This product broke within a few days of use. Would not recommend.',
            'Fantastic! Exceeded my expectations. Will definitely buy from this seller again.',
            'The product is decent but had some issues with the setup. Customer service was helpful though.',
            'Perfect fit for what I needed! Very easy to use and good build quality.',
            'Very poor quality. It broke after a week, and I couldn’t get a refund.',
            'The product is fine, but the shipping took longer than expected, which was frustrating.'
        ];

        return [
            'rating_value' => $this->faker->numberBetween(1, 5), // Random rating value between 1 and 5
            'feedback' => $this->faker->randomElement($feedbacks), // Randomly select a realistic feedback comment
            'date_created' => $this->faker->dateTimeBetween('-1 year', 'now'), // Random date within the last year
            'shipments_id' => Shipment::factory(), // Associate a shipment using the Shipment factory
            'products_id' => Product::factory(), // Associate a product using the Product factory
        ];
    }

    /**
     * Indicate that the rating is for a highly rated product.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function highlyRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating_value' => 5, // Set rating to 5
            'feedback' => 'Excellent product! Highly recommended to everyone.',
        ]);
    }

    /**
     * Indicate that the rating is for a low-rated product.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function lowRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating_value' => 1, // Set rating to 1
            'feedback' => 'Very poor quality. It broke after a few uses, not worth the price.',
        ]);
    }
}
```


## ./database/factories/LikeFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Like;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class LikeFactory extends Factory
{
    protected $model = Like::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(), // Creates a new user for each like
            'post_id' => Post::factory(), // Creates a new post for each like, adjust as needed
        ];
    }
}
```


## ./database/factories/InvoiceFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_name' => $this->faker->name(), // Random customer name
            'created_date' => $this->faker->dateTimeThisYear(), // Random date within this year
            'payment_status' => $this->faker->randomElement(['paid', 'unpaid', 'pending']), // Random payment status
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'bank_transfer']), // Random payment method
            'description' => $this->faker->sentence(), // Random description
            'shipping_cost' => $this->faker->randomFloat(2, 5, 50), // Random shipping cost between 5 and 50
            'total_amount' => $this->faker->randomFloat(2, 50, 500), // Random total amount between 50 and 500
            'paid_amount' => $this->faker->randomFloat(2, 10, 500), // Random paid amount between 10 and 500
            'due_amount' => $this->faker->randomFloat(2, 0, 500), // Random due amount between 0 and 500
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP']), // Random currency
            'discount' => $this->faker->randomFloat(2, 0, 50), // Random discount between 0 and 50
            'payments_id' => Payment::factory(), // Associate with a payment using the Payment factory
        ];
    }
}
```


## ./database/factories/UserRoleFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserRoleFactory extends Factory
{
    protected $model = UserRole::class;

    public function definition()
    {
        return [
            'users_id' => User::factory(),  // Assuming a User factory exists
            'roles_id' => Role::factory(),  // Assuming a Role factory exists
        ];
    }
}
```


## ./database/factories/UserConnectionFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\UserConnection;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
class UserConnectionFactory extends Factory
{
    protected $model = UserConnection::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(), // Create a new user for user_id
            'connection_id' => User::factory(), // Create a new user for connection_id
        ];
    }
}
```


## ./database/factories/UserFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    // Create a list of image URLs
    private static $imageUrls = [
        'https://www.cnet.com/a/img/resize/11aa4eb14e5479a9569e7cf4d887f11ab0648512/hub/2020/05/18/5bac8cc1-4bd5-4496-a8c3-66a6cd12d0cb/fb-avatar-2.jpg?auto=webp&width=768',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThTDi9zqkRyyg3e9LJGPC5lTZqB72CMSlw8g&s',
        'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR300hWAIiV7V5uxmHX5_Hvte-iABlC_tV9fw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSPmYCAnwPyxf8ySZQVO2moLKoDrDJBkKFRIROH6cjcIDEOJFLufZzjk9n805XvW9weLs&usqp=CAU',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'phone_number' => '+65 8916 4359',
            'ip_address' => $this->faker->ipv4(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'two_factor_enabled' => $this->faker->boolean(),
            'last_login' => $this->faker->dateTimeThisYear(),
            'language' => $this->faker->languageCode(),
            'is_admin' => $this->faker->boolean(),
            'last_password_change' => $this->faker->dateTimeThisYear(),
            'profile_picture' => $this->getRandomImage(),  // Random image URL
            'banner_img' => $this->getRandomImage(),  // Random image URL
            'headline' => $this->faker->sentence(),
            'about' => $this->faker->paragraph(),
        ];
    }

    /**
     * Get a random image URL from the collection.
     *
     * @return string
     */
    private function getRandomImage(): string
    {
        // Get a random key from the image URL collection and return the image URL
        return self::$imageUrls[array_rand(self::$imageUrls)];
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }

    /**
     * Indicate that the user has two-factor authentication enabled.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_enabled' => true,
        ]);
    }

    /**
     * Add connections to the user.
     *
     * @param int $userCount
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withConnections($userCount = 2)
    {
        return $this->afterCreating(function ($user) use ($userCount) {
            $connections = \App\Models\User::inRandomOrder()->take($userCount)->pluck('id')->toArray();
            $user->addConnection($connections); // Add connections
        });
    }
}
```


## ./database/factories/UserCouponFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Coupon;
use App\Models\UserCoupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCouponFactory extends Factory
{
    protected $model = UserCoupon::class;

    public function definition()
    {
        return [
            'users_id' => User::factory(),    // Assuming a User factory exists
            'coupons_id' => Coupon::factory(), // Assuming a Coupon factory exists
        ];
    }
}
```


## ./database/factories/ShipmentFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\Provider;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShipmentFactory extends Factory
{
    protected $model = Shipment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(['Pending', 'Shipped', 'In Transit', 'Delivered', 'Returned']), // Random shipment status
            'estimated_arrival' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Estimated arrival date (within the next month)
            'actual_arrival' => $this->faker->dateTimeBetween('+1 week', '+1 month'), // Actual arrival date (within the next month)
            'origin' => $this->faker->city, // Random origin city
            'destination' => $this->faker->city, // Random destination city
            'shipment_method' => $this->faker->randomElement(['Air', 'Sea', 'Land', 'Courier']), // Random shipment method
            'tracking_number' => $this->faker->regexify('[A-Z0-9]{10}'), // Random tracking number (e.g., ABC1234567)
            'last_updated' => $this->faker->dateTimeThisMonth(), // Last update date within the current month
            'total_amount' => $this->faker->randomFloat(2, 10, 500), // Total shipment cost (random between 10 and 500)
            'providers_id' => Provider::factory(), // Associate a provider using the Provider factory
            'orders_id' => Order::factory(), // Associate an order using the Order factory
        ];
    }

    /**
     * Indicate that the shipment is delivered.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Delivered',
            'actual_arrival' => now(), // Set actual arrival to now
        ]);
    }

    /**
     * Indicate that the shipment is in transit.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inTransit(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'In Transit',
            'actual_arrival' => null, // No actual arrival yet
        ]);
    }

    /**
     * Indicate that the shipment is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Pending',
            'actual_arrival' => null, // No actual arrival yet
        ]);
    }
}
```


## ./database/factories/ConnectionRequestFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\ConnectionRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConnectionRequestFactory extends Factory
{
    protected $model = ConnectionRequest::class;

    public function definition()
    {
        return [
            'sender_id' => User::factory(), // Creates a new user for the sender
            'recipient_id' => User::factory(), // Creates a new user for the recipient
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }
}
```


## ./database/factories/RoleFactory.php
```php
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
            'DeliveryMan' => 'Deliver Orders',
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
```


## ./database/factories/UserAddressFactory.php
```php
<?php
namespace Database\Factories;

use App\Models\UserAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserAddressFactory extends Factory
{
    /**
     * The model that the factory is generating.
     */
    protected $model = UserAddress::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined lists of real data for various address components
        $cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
        $states = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania'];
        $postalCodes = ['10001', '90001', '60601', '77001', '85001', '19102'];
        $countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France'];

        // Randomly pick values from the predefined lists
        $city = $cities[array_rand($cities)];
        $state = $states[array_rand($states)];
        $postalCode = $postalCodes[array_rand($postalCodes)];
        $country = $countries[array_rand($countries)];

        // Randomly generate address line 1 and address line 2 (optional)
        $addressLine1 = $this->faker->buildingNumber() . ' ' . $this->faker->streetName();
        $addressLine2 = $this->faker->optional()->secondaryAddress();

        // Randomly decide whether the address is primary
        $isPrimary = $this->faker->boolean();

        // Get a random user to associate with the address
        $userId = User::inRandomOrder()->first()->id;

        return [
            'users_id' => $userId,           // Foreign key to the user
            'address_line1' => $addressLine1, // Address line 1
            'address_line2' => $addressLine2, // Address line 2 (optional)
            'city' => $city,                  // City
            'state' => $state,                // State
            'postal_code' => $postalCode,     // Postal code
            'country' => $country,            // Country
            'is_primary' => $isPrimary,       // Whether the address is primary for the user
        ];
    }
}
```


## ./database/factories/CouponFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'discount' => $this->faker->numberBetween(5, 50), // Random discount percentage between 5 and 50
            'expiration_date' => $this->faker->dateTimeBetween('now', '+1 year'), // Random expiration date within the next year
        ];
    }
}
```


## ./database/factories/LocationHistoryFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\LocationHistory;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LocationHistoryFactory extends Factory
{
    protected $model = LocationHistory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(), // Associate a random vehicle
            'location' => $this->faker->address, // Random address
            'latitude' => $this->faker->latitude(), // Random latitude
            'longitude' => $this->faker->longitude(), // Random longitude
            'timestamp' => $this->faker->dateTimeThisYear(), // Random timestamp this year
        ];
    }

}
```


## ./database/factories/ProductFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // List of real product names
        $productNames = [
            'Bose QuietComfort 35 II Wireless Headphones',
            'Samsung 65" QLED 4K Smart TV',
            'Fitbit Charge 5 Fitness and Health Tracker',
            'JBL Flip 5 Waterproof Bluetooth Speaker',
            'Wüsthof Classic 7-Piece Knife Set',
            'Fossil Men’s RFID-Blocking Leather Wallet',
            'Nike Air Zoom Pegasus 38 Running Shoes',
            'Breville Smart Kettle with Temperature Control',
            'Anker PowerCore 20000mAh Portable Charger',
            'Herman Miller Aeron Ergonomic Office Chair'
        ];

        // List of real product descriptions for e-commerce
        $descriptions = [
            'High-quality wireless headphones with noise cancellation, deep bass, and up to 20 hours of battery life.',
            'Ultra HD 4K Smart TV with built-in streaming apps, voice control, and a slim, modern design.',
            'Track your fitness goals, heart rate, steps, calories burned, and more with this stylish smartwatch.',
            'Water-resistant Bluetooth speaker with crystal-clear sound, deep bass, and 12 hours of continuous playtime.',
            'Professional-grade stainless steel kitchen knife set with ergonomic handles and razor-sharp blades for all your cooking needs.',
            'Stylish and durable leather wallet with multiple card slots, a coin pocket, and a sleek, minimalist design.',
            'Comfortable, lightweight, and durable running shoes designed for both long-distance runs and casual wear.',
            'Cordless electric kettle with rapid boiling capabilities, temperature control, and automatic shut-off for safety and convenience.',
            'Portable power bank with a high capacity to charge your devices multiple times, perfect for travel or emergencies.',
            'Ergonomic office chair with adjustable height, lumbar support, and breathable mesh fabric for all-day comfort.'
        ];

        // Randomly select a product name and description
        $name = $this->faker->randomElement($productNames);
        $description = $this->faker->randomElement($descriptions);

        // List of image URLs for products
        $imageUrls = [
            '/1.png',
            '/2.png',
            '/3.png',
            '/4.png',
            '/5.png',
            '/6.png',
            '/7.png',
            '/8.png',
        ];

        return [
            'name' => $name, // Real product name from the list
            'price' => $this->faker->randomFloat(2, 1, 1000), // Random price between 1 and 1000 with 2 decimals
            'description' => $description, // Real product description from the list
            'supplier_id' => User::factory(), // Randomly associate a user (supplier) using the User factory
            'isFeatured' => $this->faker->boolean(50), // Randomly set the isFeatured column to true (50% chance)
            'image' => $this->faker->randomElement($imageUrls), // Select a random image URL from the list
        ];
    }
}
```


## ./database/factories/ProviderFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderFactory extends Factory
{
    protected $model = Provider::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['Shipping', 'Storage', 'Logistics', 'Packaging']), // Random provider type
            'terms_of_service' => $this->faker->paragraph, // Random terms of service text
        ];
    }
}
```


## ./database/factories/FeedbackFormFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\FeedbackForm;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormFactory extends Factory
{
    protected $model = FeedbackForm::class;

    public function definition()
    {
        // Randomly select a tech company

        return [
            'user_id' => \App\Models\User::factory(), // Assuming you have a User factory
            'order_id' => \App\Models\Order::factory(), // Assuming you have a User factory
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (FeedbackForm $FeedbackForm) {
            // Create associated FeedbackFormQuestions
            FeedbackFormQuestion::factory()
                ->count(3) // Change count as needed
                ->create(['feedback_form_id' => $FeedbackForm->id])
                ->each(function ($question) use ($FeedbackForm) {
                    // Create associated FeedbackFormAnswers for each question
                    $answer = FeedbackFormAnswer::factory()
                        ->create(['feedback_form_id' => $FeedbackForm->id]);
    
                    // Now create FeedbackFormQuestionAnswer
                    FeedbackFormQuestionAnswer::factory()
                        ->create([
                            'feedback_form_question_id' => $question->id,
                            'feedback_form_answer_id' => $answer->id,
                            'answer' => $this->faker->sentence, // Optionally add an answer
                        ]);
                });
        });
    }

}
```


## ./database/factories/ProductCategoryFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCategoryFactory extends Factory
{
    // Define the associated model
    protected $model = ProductCategory::class;

    public function definition()
    {
        // Get random product and category IDs from existing records
        return [
            'products_id' => Product::factory(),  // Random product
            'categories_id' => Category::factory(),  // Random category
        ];
    }
}
```


## ./database/factories/OrderItemFactory.php
```php
<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition()
    {
        return [
            // Generate fake data for the columns
            'orders_id' => \App\Models\Order::factory(),  // Foreign key to the Order table
            'products_id' => \App\Models\Product::factory(),  // Foreign key to the Product table
            'quantity' => $this->faker->numberBetween(1, 10),
            'total_amount' => $this->faker->randomFloat(2, 5, 100),
        ];
    }
}
```


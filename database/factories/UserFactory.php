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
            'phone_number' => $this->faker->phoneNumber(),
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

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
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vector%2Fstudent-avatar-user-profile-icon-vector-47025187&psig=AOvVaw0RQ6Q5lOzlps9ojkG1K5vI&ust=1738986472690000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCH_cvTsIsDFQAAAAAdAAAAABAE',
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngkey.com%2Fdetail%2Fu2q8u2w7e6t4q8t4_setting-user-avatar-in-specific-size-without-breaking%2F&psig=AOvVaw0RQ6Q5lOzlps9ojkG1K5vI&ust=1738986472690000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCH_cvTsIsDFQAAAAAdAAAAABAJ', // Random image
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fscalar.fas.harvard.edu%2Fstudentpower%2Fmedia%2Fuser-avatar&psig=AOvVaw0RQ6Q5lOzlps9ojkG1K5vI&ust=1738986472690000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCH_cvTsIsDFQAAAAAdAAAAABAR', // Random male portrait
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.veryicon.com%2Ficons%2Fmiscellaneous%2Fuser-avatar%2Fuser-avatar-male-5.html&psig=AOvVaw0RQ6Q5lOzlps9ojkG1K5vI&ust=1738986472690000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCH_cvTsIsDFQAAAAAdAAAAABAZ', // Random female portrait
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngarts.com%2Fexplore%2F153017&psig=AOvVaw0RQ6Q5lOzlps9ojkG1K5vI&ust=1738986472690000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCH_cvTsIsDFQAAAAAdAAAAABAh', // Random kitten image
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngplay.com%2Fimage%2F325470&psig=AOvVaw0RQ6Q5lOzlps9ojkG1K5vI&ust=1738986472690000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCH_cvTsIsDFQAAAAAdAAAAABA_', // Bill Murray image
        // Add more URLs as needed
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

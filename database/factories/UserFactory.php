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

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone_number' => fake()->phoneNumber(),
            'ip_address' => fake()->ipv4(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'two_factor_enabled' => fake()->boolean(),
            'last_login' => fake()->dateTimeThisYear(),
            'language' => fake()->languageCode(),
            'is_admin' => fake()->boolean(),
            'last_password_change' => fake()->dateTimeThisYear(),
            'profile_picture' => $this->faker->imageUrl(),
            'banner_img' => $this->faker->imageUrl(),
            'headline' => $this->faker->sentence(),
            'about' => $this->faker->paragraph(),
        ];
    }
    public function withConnections($userCount = 2)
    {
        return $this->afterCreating(function ($user) use ($userCount) {
            $connections = \App\Models\User::inRandomOrder()->take($userCount)->pluck('id')->toArray();
            $user->addConnection($connections); // Add connections
        });
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
}

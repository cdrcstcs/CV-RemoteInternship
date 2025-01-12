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

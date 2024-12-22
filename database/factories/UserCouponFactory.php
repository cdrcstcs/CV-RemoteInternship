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

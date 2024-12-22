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

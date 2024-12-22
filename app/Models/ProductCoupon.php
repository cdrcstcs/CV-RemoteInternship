<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductCoupon extends Model
{
    use HasFactory;
    // Specify the table name (optional if following naming convention)
    protected $table = 'products_coupons';

    // Disable Eloquent timestamps if you don't want them (optional)
    public $timestamps = true;

    // Define the fillable attributes (if any)
    protected $fillable = [
        'products_id',
        'coupons_id',
    ];

    // Define the relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id');
    }

    // Define the relationship with Coupon
    public function coupon()
    {
        return $this->belongsTo(Coupon::class, 'coupons_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    // Define the table name if it doesn't follow Laravel's naming convention
    protected $table = 'coupons';

    // If needed, define the columns that are fillable
    protected $fillable = [
        'code',
        'discount',
        'expiration_date',
        'is_active',
    ];

    // You can also define any specific logic for this model, if necessary.
}

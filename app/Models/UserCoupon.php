<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserCoupon extends Model
{
    use HasFactory;
    // Since it's a pivot table, we don’t need timestamps.
    public $timestamps = true;

    // Define the table name (optional, can be inferred by Laravel).
    protected $table = 'users_coupons';

    // Define the composite primary key (Laravel doesn’t natively support composite keys).
    protected $primaryKey = ['users_id', 'coupons_id'];

    // Disable auto-incrementing, as this table doesn't have an auto-incrementing primary key.
    public $incrementing = false;

    // Define the attributes that are mass assignable (for security).
    protected $fillable = ['users_id', 'coupons_id'];
}

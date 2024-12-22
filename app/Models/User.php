<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = 'users'; // Specifies the table name

    protected $primaryKey = 'id'; // Primary key column name

    public $timestamps = true; // Indicates whether the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'ip_address',
        'email',
        'password',
        'two_factor_enabled',
        'last_login',
        'language',
        'is_admin',
        'last_password_change',
    ];

    protected $casts = [
        'two_factor_enabled' => 'boolean', // Casts the two_factor_enabled attribute to a boolean value
        'is_admin' => 'boolean', // Casts the is_admin attribute to a boolean value
        'last_login' => 'datetime', // Automatically casts to a datetime
        'last_password_change' => 'datetime', // Automatically casts to a datetime
    ];

    // Optionally, add any relationships or additional methods here
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'users_roles', 'users_id', 'roles_id');
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'users_coupons', 'users_id', 'coupons_id')
            ->withTimestamps();  // Include timestamps if needed
    }
}

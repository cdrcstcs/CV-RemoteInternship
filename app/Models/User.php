<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;  // Use Authenticatable
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Correct namespace for HasFactory

class User extends Authenticatable  // Extend Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'users';

    protected $primaryKey = 'id';

    public $timestamps = true;

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
        'two_factor_enabled' => 'boolean',
        'is_admin' => 'boolean',
        'last_login' => 'datetime',
        'last_password_change' => 'datetime',
    ];

    // Relationships and other methods as usual
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'users_roles', 'users_id', 'roles_id');
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'users_coupons', 'users_id', 'coupons_id')->withTimestamps();
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}

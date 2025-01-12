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

    // User can have many orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'users_coupons', 'users_id', 'coupons_id')->withTimestamps();
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'users_id');
    }

    public function primaryAddress()
    {
        // Corrected: Return a relationship instance
        return $this->hasOne(UserAddress::class, 'users_id')->where('is_primary', true);
    }


    // Get the user's primary address as a concatenated string
    public function getPrimaryAddress()
    {
        $address = $this->primaryAddress;

        if ($address) {
            // Combine the address components into a single string
            $addressString = $address->address_line1;

            if ($address->address_line2) {
                $addressString .= ', ' . $address->address_line2;
            }

            $addressString .= ', ' . $address->city;
            $addressString .= ', ' . $address->state;
            $addressString .= ' ' . $address->postal_code;
            $addressString .= ', ' . $address->country;

            return $addressString; // Return the combined address string
        }

        return null;  // No address found
    }

}

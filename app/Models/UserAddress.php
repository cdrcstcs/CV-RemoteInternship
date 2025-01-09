<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    // Define the table name if it's not plural of the model name
    protected $table = 'user_addresses';

    // Set the primary key if it's not the default 'id'
    protected $primaryKey = 'id';

    // Enable timestamps if you want to track created_at and updated_at
    public $timestamps = true;

    // Define the fillable fields
    protected $fillable = [
        'users_id',      // Foreign key for the user
        'address_line1', // Address line 1
        'address_line2', // Address line 2 (optional)
        'city',          // City
        'state',         // State
        'postal_code',   // Postal code
        'country',       // Country
        'is_primary',    // Whether the address is the primary one for the user
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}

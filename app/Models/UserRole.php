<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserRole extends Model
{
    use HasFactory;

    // Since this is a pivot table, we often don’t need the default timestamps.
    public $timestamps = false;

    // Define the table name (optional, but can be useful for clarity).
    protected $table = 'users_roles';

    // Disable auto-increment, as this is not an autoincrementing table.
    public $incrementing = false;

    // Define the attributes that are mass assignable (for security).
    protected $fillable = ['roles_id', 'users_id'];

    // Define the relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    // Define the relationship with Role
    public function role()
    {
        return $this->belongsTo(Role::class, 'roles_id');
    }
}

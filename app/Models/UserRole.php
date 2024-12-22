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

    // Define the composite primary key (Laravel doesn't support composite keys by default).
    protected $primaryKey = ['roles_id', 'users_id'];

    // Disable auto-increment, as this is not an autoincrementing table.
    public $incrementing = false;

    // Define the attributes that are mass assignable (for security).
    protected $fillable = ['roles_id', 'users_id'];
}

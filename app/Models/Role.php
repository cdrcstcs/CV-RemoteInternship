<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Laravel will automatically manage the 'created_at' and 'updated_at' columns

    protected $fillable = [
        'role_name', 'description'
    ];

    // Define relationships (if needed)
}

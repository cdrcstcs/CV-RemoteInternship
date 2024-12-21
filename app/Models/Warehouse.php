<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $table = 'warehouses'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'warehouse_name', 'location', 'capacity', 'available_space', 'users_id'
    ];

    // Define the relationship to the User model (user who owns the warehouse)
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}

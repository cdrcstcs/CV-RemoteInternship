<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleManagement extends Model
{
    use HasFactory;

    protected $table = 'vehicle_management'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'location_history',
        'fuel_consumption',
        'distance_traveled',
        'maintenance_status',
        'last_maintenance_date',
        'maintenance_schedule',
        'maintenance_cost',
        'users_id',
    ];

    // Define the relationship to the User model (user who owns the vehicle)
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}

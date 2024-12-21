<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $table = 'vehicles'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Automatically manage 'created_at' and 'updated_at'

    protected $fillable = [
        'license_plate', 'type', 'driver_id', 'capacity', 'fuel_capacity', 
        'current_location', 'last_serviced', 'status', 'last_fuel_refill', 
        'last_location_update', 'mileage', 'maintenance_logs', 'vehicle_management_id'
    ];

    // Relationships

    /**
     * Get the driver (user) associated with the vehicle.
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the vehicle management record associated with the vehicle.
     */
    public function vehicleManagement()
    {
        return $this->belongsTo(VehicleManagement::class, 'vehicle_management_id');
    }
}

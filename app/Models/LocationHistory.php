<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationHistory extends Model
{
    use HasFactory;

    protected $table = 'location_histories'; // Table name
    public $timestamps = true; // Automatically manage 'created_at' and 'updated_at'

    // Define the fillable fields
    protected $fillable = [
        'vehicle_id', 'location', 'latitude', 'longitude', 'timestamp'
    ];

    /**
     * Get the vehicle associated with this location history.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class); // A location history belongs to one vehicle
    }
}

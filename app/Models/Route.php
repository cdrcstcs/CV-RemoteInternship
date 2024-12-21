<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $table = 'routes'; // Table name
    protected $primaryKey = 'id'; // Primary key column
    public $timestamps = true; // Automatically manage 'created_at' and 'updated_at'

    protected $fillable = [
        'route_name', 'start_location', 'end_location', 'estimated_time', 'distance', 
        'route_type', 'traffic_condition', 'route_status', 'last_optimized', 
        'shipments_id', 'vehicles_id'
    ];

    // Relationships

    /**
     * Get the shipment associated with the route.
     */
    public function shipment()
    {
        return $this->belongsTo(Shipment::class, 'shipments_id');
    }

    /**
     * Get the vehicle associated with the route.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicles_id');
    }
}

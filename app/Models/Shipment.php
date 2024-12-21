<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $table = 'shipments'; // Table name

    protected $primaryKey = 'id'; // Primary key column (composite key handled via migration)

    public $timestamps = true; // Laravel will automatically manage the 'created_at' and 'updated_at' columns

    protected $fillable = [
        'status', 'estimated_arrival', 'actual_arrival', 'origin', 'destination',
        'shipment_method', 'tracking_number', 'last_updated', 'total_amount', 
        'providers_id', 'orders_id'
    ];

    // Define relationships

    /**
     * Get the provider that owns the shipment.
     */
    public function provider()
    {
        return $this->belongsTo(Provider::class, 'providers_id');
    }

    /**
     * Get the order that owns the shipment.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'orders_id');
    }
}

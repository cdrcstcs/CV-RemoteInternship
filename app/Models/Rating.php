<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $table = 'ratings'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Laravel will automatically manage the 'created_at' and 'updated_at' columns

    protected $fillable = [
        'rating_value', 'feedback', 'date_created', 'shipments_id', 'products_id'
    ];

    // Define relationships

    /**
     * Get the shipment that owns the rating.
     */
    public function shipment()
    {
        return $this->belongsTo(Shipment::class, 'shipments_id');
    }

    /**
     * Get the product that owns the rating.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id');
    }
}

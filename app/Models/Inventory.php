<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'stock', 'last_updated', 'weight_per_unit', 'products_id', 'warehouses_id'
    ];

    // Define the relationship to the Product model (inventory belongs to a product)
    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id');
    }

    // Define the relationship to the Warehouse model (inventory belongs to a warehouse)
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouses_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'order_items'; // Note that Laravel will use the plural form "order_items"
    protected $primaryKey = 'id';  // Default primary key

    // Define the columns that can be mass-assigned
    protected $fillable = [
        'quantity', 'total_amount', 'orders_id', 'products_id'
    ];

    // Relationship to Order
    public function order()
    {
        return $this->belongsTo(Order::class, 'orders_id');
    }

    // Relationship to Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id');
    }
}

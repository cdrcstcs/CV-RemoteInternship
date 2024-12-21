<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'total_amount', 'paid_amount', 'due_amount', 'payment_method', 'payment_status', 'payment_date', 'gateway', 'currency', 'order_id', 'providers_id'
    ];

    // Define the relationship to the Order model (payment belongs to an order)
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    // Define the relationship to the Provider model (payment belongs to a provider)
    public function provider()
    {
        return $this->belongsTo(Provider::class, 'providers_id');
    }
}

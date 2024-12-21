<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices'; // Table name
    protected $primaryKey = 'id'; // Primary key column
    public $timestamps = true; // Automatically manage 'created_at' and 'updated_at'

    protected $fillable = [
        'customer_name', 'created_date', 'payment_status', 'payment_method', 'description',
        'shipping_cost', 'total_amount', 'paid_amount', 'due_amount', 'currency', 
        'discount', 'payments_id'
    ];

    // Relationships

    /**
     * Get the payment associated with the invoice.
     */
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payments_id');
    }
}

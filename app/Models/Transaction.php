<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions'; // Set the table name if it's different from the model name
    
    // Define the fillable properties
    protected $fillable = [
        'id', 'name', 'payment_channel', 'type', 'account_id', 'amount', 'pending', 
        'category', 'date', 'image', 'channel', 'sender_bank_id', 'receiver_bank_id'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
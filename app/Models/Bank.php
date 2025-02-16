<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;

    protected $table = 'banks'; // Set the table name if it's different from the model name
    
    // Define the fillable properties
    protected $fillable = [
        'account_id', 'bank_id', 'access_token', 'funding_source_url', 
        'user_id', 'shareable_id'
    ];

    // Define any relationships if necessary
    // Example: If Bank has many Transactions
    // public function transactions()
    // {
    //     return $this->hasMany(Transaction::class);
    // }
}
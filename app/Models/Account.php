<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts'; // Set the table name if it's different from the model name
    
    // Define the fillable properties
    protected $fillable = [
        'id', 'available_balance', 'current_balance', 'official_name', 'mask', 
        'institution_id', 'name', 'type', 'subtype', 'appwrite_item_id', 'shareable_id'
    ];

    // Define any relationships here (if applicable)
    // Example: If Account has many Transactions
    // public function transactions()
    // {
    //     return $this->hasMany(Transaction::class);
    // }
}
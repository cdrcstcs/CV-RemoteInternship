<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'name', 'price', 'description', 'supplier_id'
    ];

    // Define the relationship to the User model (supplier of the product)
    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}

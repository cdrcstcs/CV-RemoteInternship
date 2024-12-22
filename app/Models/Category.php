<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'category_name', 'description'
    ];

    // Define relationships if needed (for example, categories can have many products)
    // public function products() {
    //     return $this->hasMany(Product::class);
    // }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'products_categories', 'categories_id', 'products_id');
    }
}

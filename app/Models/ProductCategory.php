<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductCategory extends Model
{
    use HasFactory;
    // Since it's a pivot table, we often don’t need the default timestamps.
    public $timestamps = false;

    // Define the table name (optional since Laravel can infer it).
    protected $table = 'products_categories';

    // Define the primary key for this table (composite primary key is not natively supported by Eloquent).
    // But you can manually handle the composite key logic, or just rely on the pivot table's simplicity.
    protected $primaryKey = ['products_id', 'categories_id'];

    // Disable auto-increment as this is not an autoincrementing table.
    public $incrementing = false;

    // If needed, you can define the fillable attributes for mass assignment.
    protected $fillable = ['products_id', 'categories_id'];

    // Define relationships, but typically, pivot models don’t have additional methods.
}

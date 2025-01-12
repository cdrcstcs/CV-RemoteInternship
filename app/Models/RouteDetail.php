<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_optimization_id',
        'route_name',
        'supplier_name',
        'warehouse_name_1',
        'warehouse_name_2',
        'distance',
    ];

    /**
     * Define the relationship with the RouteOptimization model.
     */
    public function routeOptimization()
    {
        return $this->belongsTo(RouteOptimization::class);
    }
}

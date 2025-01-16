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
        'start_location',
        'end_location',
        'start_latitude',
        'start_longitude',
        'end_latitude',
        'end_longitude',
        'estimated_time',
        'distance',
        'route_condition_id'
    ];

    /**
     * Define the relationship with the RouteOptimization model.
     */
    public function routeOptimization()
    {
        return $this->belongsTo(RouteOptimization::class);
    }
    public function routeCondition()
    {
        return $this->belongsTo(RouteCondition::class, 'route_condition_id');
    }
}

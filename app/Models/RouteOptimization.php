<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteOptimization extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipments_id',
        'total_distance',
    ];

    /**
     * Define the relationship with the RouteDetail model.
     */
    public function routeDetails()
    {
        return $this->hasMany(RouteDetail::class);
    }

    /**
     * Define the relationship with the Shipment model.
     */
    public function shipment()
    {
        return $this->belongsTo(Shipment::class,'shipments_id');
    }
}

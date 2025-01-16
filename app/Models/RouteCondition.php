<?php
// app/Models/RouteCondition.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteCondition extends Model
{
    use HasFactory;

    protected $fillable = [
        'weather',
        'road_condition',
        'traffic_condition',
        'has_accident',
        'accident_description',
        'road_closure_description',
        'reported_at',
    ];

}

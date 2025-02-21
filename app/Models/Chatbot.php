<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chatbot extends Model
{
    use HasFactory;

    // Define the table name (optional if following Laravel's convention)
    protected $table = 'chatbots';

    // Define the fillable fields (for mass assignment)
    protected $fillable = [
        'user_id',
        'history',
    ];

    // Specify that the history field is a JSON type
    protected $casts = [
        'history' => 'array',  // Automatically cast to an array
    ];

    // Optionally, you can define relationships or other methods here
}

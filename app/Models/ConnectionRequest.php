<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConnectionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id', // Changed for clarity
        'recipient_id', // Changed for clarity
        'status',
    ];

    protected $attributes = [
        'status' => 'pending', // Default status for new requests
    ];

    // Define relationships
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id'); // Specify foreign key for clarity
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id'); // Specify foreign key for clarity
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_id',  // Changed to recipient_id for clarity
        'type',
        'related_user', // Changed for clarity
        'related_post', // Changed for clarity
        'read',
    ];

    protected $casts = [
        'read' => 'boolean', // Cast read to boolean
    ];

    protected $attributes = [
        'read' => false, // Default to unread
    ];

    // Define notification types as constants
    const TYPES = [
        'like',
        'comment',
        'connectionAccepted',
    ];

    // Validation method for notification types
    public static function isValidType($type)
    {
        return in_array($type, self::TYPES);
    }

    // Define relationships
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id'); // Specify foreign key for clarity
    }

    public function relatedUser()
    {
        return $this->belongsTo(User::class, 'related_user'); // Specify foreign key for clarity
    }

    public function relatedPost()
    {
        return $this->belongsTo(Post::class, 'related_post'); // Specify foreign key for clarity
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StreamMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'creator_id', // Creator (sender) ID
        'viewer_id',  // Viewer (receiver) ID
        'stream_id',  // Foreign key to the Stream model
    ];

    // Creator is the sender of the message
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    // Viewer is the receiver of the message
    public function viewer()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }

    // Relationship with the stream this message belongs to
    public function stream()
    {
        return $this->belongsTo(Stream::class, 'stream_id');
    }
}
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stream extends Model
{
    use HasFactory;

    protected $table = 'streams';

    protected $fillable = [
        'title',
        'thumbnail',
        'ingressId',
        'serverUrl',
        'streamKey',
        'isLive',
        'isChatEnabled',
        'isChatDelayed',
        'isChatFollowersOnly',
        'user_id',
    ];

    // Relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship with StreamMessage model
    public function streamMessages()
    {
        return $this->hasMany(StreamMessage::class, 'stream_id');
    }

    // Relationship with StreamGift model
    public function gifts()
    {
        return $this->hasMany(StreamGift::class, 'stream_id'); // A Stream can have many gifts
    }
}

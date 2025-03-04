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
}

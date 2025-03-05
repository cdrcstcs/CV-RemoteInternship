<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\GiftTypeEnum;

class StreamGift extends Model
{
    use HasFactory;

    // Table name (optional, Laravel will guess it)
    protected $table = 'stream_gifts';

    // Define fillable attributes
    protected $fillable = [
        'owner_id',
        'gift_type',
        'price', // Add the price attribute to the fillable array
        'stream_id', // The foreign key referencing the stream
    ];

    // Relationship with the User model (assuming owner is a user)
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Relationship with the Stream model
    public function stream()
    {
        return $this->belongsTo(Stream::class, 'stream_id'); // A StreamGift belongs to a Stream
    }
    
    // Accessor to get human-readable gift name
    public function getGiftNameAttribute()
    {
        return ucfirst(str_replace('_', ' ', $this->gift_type));
    }

    // Set price based on gift type
    public function setPriceBasedOnGiftType()
    {
        switch ($this->gift_type) {
            case GiftTypeEnum::Lion->value:
                return 100.00; // Price for 'lion' gift
            case GiftTypeEnum::Flower->value:
                return 50.00; // Price for 'flower' gift
            case GiftTypeEnum::Star->value:
                return 200.00; // Price for 'star' gift
            case GiftTypeEnum::Heart->value:
                return 150.00; // Price for 'heart' gift
            default:
                return 0.00; // Default price
        }
    }

    // Override the saving method to set the price before saving the gift
    public static function boot()
    {
        parent::boot();

        static::creating(function ($streamGift) {
            $streamGift->price = $streamGift->setPriceBasedOnGiftType();
        });
    }
}

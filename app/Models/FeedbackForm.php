<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackForm extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'created_at', 'updated_at','order_id'];

    public function questions()
    {
        return $this->hasMany(FeedbackFormQuestion::class);
    }

    public function answers()
    {
        return $this->hasMany(FeedbackFormAnswer::class);
    }
}

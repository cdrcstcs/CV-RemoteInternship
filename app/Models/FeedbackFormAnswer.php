<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackFormAnswer extends Model
{
    use HasFactory;

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = ['feedback_form_id', 'start_date', 'end_date'];

    public function feedbackForm()
    {
        return $this->belongsTo(FeedbackForm::class);
    }
}

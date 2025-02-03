<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackFormQuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['feedbackform_question_id', 'feedbackform_answer_id', 'answer'];
}

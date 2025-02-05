<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackFormQuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['feedback_form_question_id', 'feedback_form_answer_id', 'answer'];
}

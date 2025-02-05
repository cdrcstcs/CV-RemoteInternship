<?php

namespace Database\Factories;

use App\Models\FeedbackFormQuestionAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormQuestionAnswerFactory extends Factory
{
    protected $model = FeedbackFormQuestionAnswer::class;

    public function definition()
    {
        return [
            'feedback_form_question_id' => \App\Models\FeedbackFormQuestion::factory(), // Create a question if it doesn't exist
            'feedback_form_answer_id' => \App\Models\FeedbackFormAnswer::factory(), // Create an answer if it doesn't exist
            'answer' => $this->faker->sentence,
        ];
    }
}

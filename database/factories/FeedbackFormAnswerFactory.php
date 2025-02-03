<?php

namespace Database\Factories;

use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormAnswerFactory extends Factory
{
    protected $model = FeedbackFormAnswer::class;

    public function definition()
    {
        return [
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
            'feedbackform_id' => null, // Set later
        ];
    }
}

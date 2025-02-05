<?php

namespace Database\Factories;

use App\Models\FeedbackForm;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormFactory extends Factory
{
    protected $model = FeedbackForm::class;

    public function definition()
    {
        // Randomly select a tech company

        return [
            'user_id' => \App\Models\User::factory(), // Assuming you have a User factory
            'order_id' => \App\Models\Order::factory(), // Assuming you have a User factory
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (FeedbackForm $FeedbackForm) {
            // Create associated FeedbackFormQuestions
            FeedbackFormQuestion::factory()
                ->count(3) // Change count as needed
                ->create(['feedback_form_id' => $FeedbackForm->id])
                ->each(function ($question) use ($FeedbackForm) {
                    // Create associated FeedbackFormAnswers for each question
                    $answer = FeedbackFormAnswer::factory()
                        ->create(['feedback_form_id' => $FeedbackForm->id]);
    
                    // Now create FeedbackFormQuestionAnswer
                    FeedbackFormQuestionAnswer::factory()
                        ->create([
                            'feedback_form_question_id' => $question->id,
                            'feedback_form_answer_id' => $answer->id,
                            'answer' => $this->faker->sentence, // Optionally add an answer
                        ]);
                });
        });
    }

}

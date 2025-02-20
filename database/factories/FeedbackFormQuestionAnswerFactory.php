<?php
namespace Database\Factories;

use App\Models\FeedbackFormQuestionAnswer;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFormQuestionAnswerFactory extends Factory
{
    protected $model = FeedbackFormQuestionAnswer::class;

    public function definition()
    {
        // Define possible answers for feedback questions.
        $answers = [
            'Very satisfied with my purchase. Everything was perfect!',
            'Satisfied with the product, but shipping took longer than expected.',
            'The product didn’t match the description. I am disappointed.',
            'The product is good, but the packaging was damaged.',
            'Customer service was excellent, and the product quality is great!',
            'Not satisfied. The item was faulty, and the return process was confusing.',
            'Great value for money, will buy again.',
            'I had issues with the payment process, but the product itself is fine.',
            'The quality of the product exceeded my expectations.',
            'The product was as described, but the delivery service could be better.',
            'Very disappointed, I will not be purchasing again.',
            'The return process was easy, but the product didn’t work for me.',
            'Good product, but I wish there were more color options.',
            'Product was damaged on arrival, very dissatisfied.',
            'The product is okay but not worth the price.',
            'Excellent product and the delivery was very quick!',
            'I am happy with my purchase but had difficulty navigating the website.',
            'The product broke after one use, I want a refund.',
            'Not happy with the customer service response time.',
            'The product is exactly what I was looking for, would recommend.',
        ];

        return [
            'feedback_form_question_id' => FeedbackFormQuestion::factory(), // Create a question if it doesn't exist
            'feedback_form_answer_id' => FeedbackFormAnswer::factory(), // Create an answer if it doesn't exist
            'answer' => $this->faker->randomElement($answers), // Randomly pick an answer from the predefined list
        ];
    }
}

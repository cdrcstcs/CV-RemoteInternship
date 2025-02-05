<?php

namespace Database\Factories;

use App\Models\FeedbackFormQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FeedbackFormQuestionFactory extends Factory
{
    protected $model = FeedbackFormQuestion::class;

    // Array mapping questions to their descriptions and answers for an e-commerce platform
    private $feedbackQuestions = [
        'How would you rate the speed of delivery?' => [
            'description' => 'Please provide your feedback on the delivery time and whether it met your expectations.',
            'answers' => [
                'The delivery was quick and arrived ahead of schedule.',
                'The delivery took longer than expected, and I was disappointed.',
                'The delivery was on time, and I am satisfied with the service.',
            ],
        ],
        'How satisfied are you with the condition of the product upon arrival?' => [
            'description' => 'Share your experience with the product’s condition when it was delivered.',
            'answers' => [
                'The product arrived in perfect condition, exactly as described.',
                'The product was damaged during shipping, and I had to return it.',
                'The product was slightly damaged but still usable.',
            ],
        ],
        'How easy was it to place your order on our website?' => [
            'description' => 'Provide feedback on the ease of the ordering process on our website.',
            'answers' => [
                'The website was very easy to navigate, and I had no issues placing my order.',
                'I had some trouble finding the product I wanted and checking out.',
                'The order process was confusing, and I had to contact customer service.',
            ],
        ],
        'Were the product details accurate on the website?' => [
            'description' => 'Tell us whether the product descriptions, images, and specifications matched what you received.',
            'answers' => [
                'The product was exactly as described on the website.',
                'The product did not match the description; I was disappointed with the mismatch.',
                'Some aspects of the product description were inaccurate or unclear.',
            ],
        ],
        'How satisfied are you with the packaging of your order?' => [
            'description' => 'Please share your feedback regarding the packaging of your product.',
            'answers' => [
                'The product was well-packaged and protected during transit.',
                'The packaging was poor, and the product was slightly damaged.',
                'The packaging was sufficient but could have been improved.',
            ],
        ],
        'How would you rate the communication regarding your order status?' => [
            'description' => 'Provide feedback on how well we kept you informed about your order status and any updates.',
            'answers' => [
                'I received timely updates, and I was always informed about my order status.',
                'I did not receive enough communication and had to check manually.',
                'I was not informed about any delays or issues with my order.',
            ],
        ],
        'How satisfied are you with the quality of the product?' => [
            'description' => 'Give feedback on the quality of the product you received.',
            'answers' => [
                'The product exceeded my expectations and was of high quality.',
                'The product was not as expected and felt low quality.',
                'The product was of acceptable quality, but not as good as I had hoped.',
            ],
        ],
        'How likely are you to recommend this product to others?' => [
            'description' => 'Share whether you would recommend this product to friends or family.',
            'answers' => [
                'I would highly recommend this product to others.',
                'I would not recommend this product due to poor quality.',
                'I might recommend this product depending on the needs of the person.',
            ],
        ],
        'Was the product available when you wanted to purchase it?' => [
            'description' => 'Tell us if you were able to find and order the product easily.',
            'answers' => [
                'The product was readily available and I had no issues purchasing it.',
                'The product was out of stock, and I had to wait longer for delivery.',
                'The product was listed but later marked as unavailable.',
            ],
        ],
        'How do you rate the variety of products on our website?' => [
            'description' => 'Provide feedback on the range of products available on our site.',
            'answers' => [
                'There is a wide variety of products, and I found everything I needed.',
                'The product selection was limited, and I could not find what I wanted.',
                'The variety of products is good, but there could be more options.',
            ],
        ],
        'How easy was the return process if your order didn’t meet expectations?' => [
            'description' => 'Share your experience with our return process.',
            'answers' => [
                'The return process was straightforward and quick.',
                'The return process was complicated and took too long.',
                'The return process was acceptable, but it could be improved.',
            ],
        ],
        'How did you find the pricing of the product?' => [
            'description' => 'Tell us if you think the product was priced fairly based on its quality and the competition.',
            'answers' => [
                'The product was priced fairly and matched the quality.',
                'The product was overpriced compared to similar products.',
                'The product was a great deal considering its quality.',
            ],
        ],
        'Did you experience any issues during checkout?' => [
            'description' => 'Please share if you faced any issues while completing your order.',
            'answers' => [
                'The checkout process was smooth and easy.',
                'I encountered some issues during checkout but eventually completed the order.',
                'I had significant issues during checkout and had to contact support.',
            ],
        ],
        'How do you feel about the shipping costs?' => [
            'description' => 'Tell us if you think the shipping fees were reasonable for the service provided.',
            'answers' => [
                'The shipping costs were reasonable for the delivery time and service.',
                'The shipping was too expensive, especially for standard delivery.',
                'I was happy with the free shipping offer and did not mind the price.',
            ],
        ],
        'How would you rate our customer service if you contacted them?' => [
            'description' => 'Provide feedback on any interaction with our customer service team.',
            'answers' => [
                'Customer service was very helpful and resolved my issue quickly.',
                'Customer service was slow to respond and didn’t fully resolve my issue.',
                'I did not need to contact customer service.',
            ],
        ],
        'How would you rate the overall ordering experience on our website?' => [
            'description' => 'Give an overall rating of your experience with our online store.',
            'answers' => [
                'The overall experience was excellent, and I will shop here again.',
                'The experience was okay, but there are a few things that could be improved.',
                'I did not have a good experience and may not shop here again.',
            ],
        ],
        'How satisfied are you with the ease of finding products on our website?' => [
            'description' => 'Please share if you found it easy to search for and find the products you wanted.',
            'answers' => [
                'The website’s search and filters made it easy to find what I was looking for.',
                'The search functionality was okay, but it could be improved.',
                'I had trouble finding what I was looking for on the website.',
            ],
        ],
        'Did the product meet your expectations based on the website images and descriptions?' => [
            'description' => 'Let us know if the product matched your expectations after viewing it online.',
            'answers' => [
                'The product was exactly as shown and described on the website.',
                'The product didn’t match the online description or image.',
                'Some aspects of the product were different from what I expected based on the description.',
            ],
        ],
        'How would you rate your overall satisfaction with the product delivery?' => [
            'description' => 'Please share your thoughts on the overall delivery process.',
            'answers' => [
                'I am very satisfied with the delivery service.',
                'I was dissatisfied with the delivery and had issues with the service.',
                'The delivery was acceptable, but it could be improved.',
            ],
        ],
        'Would you consider purchasing from us again in the future?' => [
            'description' => 'Let us know if you would consider buying from our website again based on this experience.',
            'answers' => [
                'Yes, I will definitely shop here again.',
                'I might consider shopping here again depending on future experiences.',
                'I would not consider shopping here again based on my current experience.',
            ],
        ],
    ];




    public function definition()
    {
        // Randomly select a question and its corresponding description and answers
        $question = $this->faker->randomElement(array_keys($this->feedbackQuestions));
        $description = $this->feedbackQuestions[$question]['description'];
        $answers = $this->feedbackQuestions[$question]['answers'];

        // Randomly decide if 'data' will be text or an options array
        $dataType = $this->faker->randomElement(['text','select', 'radio', 'checkbox','textarea' ]);

        if ($dataType != 'text' && $dataType != 'textarea') {
            // Create options based on the answers for the question
            $options = [
                'options' => array_map(function ($answer) {
                    return [
                        'uuid' => (string) Str::uuid(),
                        'text' => $answer,
                    ];
                }, $answers),
            ];
            $data = json_encode($options); // Encode the array as a JSON string
        } else {
            $data = $this->faker->text; // Simple text (if needed for some questions)
        }

        return [
            'type' => $dataType, // Keep this if you have different types
            'question' => $question, // Random job question
            'description' => $description, // Corresponding job description
            'data' => $data,
            'feedback_form_id' => null, // Set later
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Chatbot;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChatbotFactory extends Factory
{
    protected $model = Chatbot::class;

    public function definition()
    {
        return [
            'user_id' => 1, // Assigning user_id as 1
            'history' => $this->generateHistory(), // Call the method to generate the history
        ];
    }

    // Helper method to generate the history structure with more consistent and varied data
    private function generateHistory()
    {
        // Predefined patterns for 'user' and 'model' roles
        $history = [
            // Initial greeting
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'Hi, I need help with my account.']
                ],
                'img' => null,
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'Hello! How can I assist you today?']
                ],
                'img' => null,
            ],
            // Account-related issue
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'I’m having trouble logging in.']
                ],
                'img' => null,
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'I see. Are you receiving any error messages?']
                ],
                'img' => null,
            ],
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'Yes, it says my password is incorrect.']
                ],
                'img' => null,
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'Got it. Have you tried resetting your password yet?']
                ],
                'img' => null,
            ],
            // Resetting password flow with a slight variance
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'I tried, but I didn’t get the reset email.']
                ],
                'img' => null,
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'Hmm, that’s strange. Please check your spam folder.']
                ],
                'img' => null,
            ],
            // Offering assistance with further issues
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'I checked, and it’s not there. What should I do next?']
                ],
                'img' => null,
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'I can help you with that. Let me escalate the issue.']
                ],
                'img' => null,
            ],
            [
                'role' => 'user',
                'parts' => [
                    ['text' => 'Thanks for your help!']
                ],
                'img' => null,
            ],
            [
                'role' => 'model',
                'parts' => [
                    ['text' => 'You’re welcome! Let me know if you need anything else.']
                ],
                'img' => null,
            ],
        ];

        return $history; // Return the predefined, varied conversation history
    }
}

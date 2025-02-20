<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Group;

class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Predefined set of real message content related to e-commerce scenarios
        $messages = [
            'Hi, I have a question about the product I ordered. Is it compatible with model XYZ?',
            'My order hasn’t arrived yet. Can you provide an update on the delivery status?',
            'I would like to return an item I purchased. Could you please assist me with the process?',
            'Can you help me track my order? I ordered it over a week ago and haven’t received any updates.',
            'I received the wrong product. Please let me know how to return it.',
            'The quality of the item doesn’t match the description. I would like a refund.',
            'I received my package, but it was damaged. What steps do I need to take for a replacement?',
            'I would like to know when this item will be back in stock. Can you provide any information?',
            'Can you recommend similar products? I’m not satisfied with my current purchase.',
            'Thank you for the fast shipping! I’m very happy with the product.',
            'I love this product! It’s exactly what I was looking for.',
            'How can I change my shipping address for an existing order?',
            'Is there any way to expedite my order? I need it urgently.',
            'Do you have a size guide for your clothing? I’m unsure about which size to select.',
            'I’m not able to apply my discount code. Could you assist with that?',
            'Can I cancel my order? I made a mistake while ordering.',
            'The product was great, but I didn’t like the packaging. Can you improve it?',
        ];

        // Randomly pick a message from the predefined list
        $messageContent = $this->faker->randomElement($messages);

        // Logic for determining sender and receiver, or group
        $senderId = $this->faker->randomElement([0, 1]);
        if ($senderId === 0) {
            $senderId = $this->faker
                ->randomElement(User::where('id', '!=', 1)
                    ->pluck('id')->toArray());
            $receiverId = 1;
        } else {
            $receiverId = $this->faker->randomElement(User::pluck('id')->toArray());
        }

        $groupId = null;
        if ($this->faker->boolean(50)) {
            $groupId = $this->faker->randomElement(Group::pluck('id')->toArray());
            // Select group by group_id
            $group = Group::find($groupId);
            $senderId = $this->faker->randomElement($group->users->pluck('id')->toArray());
            $receiverId = null;
        }

        return [
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
            'message' => $messageContent,  // Using the real message content
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}

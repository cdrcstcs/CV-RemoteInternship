<?php
namespace App\Http\Controllers;

use App\Models\ChatBot;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatBotController extends Controller
{
    // Store a new chat
    public function storeChat(Request $request)
    {
        $userId = $request->user()->id;  // Get the currently authenticated user's ID
        $text = $request->input('text');

        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            // CREATE A NEW CHAT
            $chat = new ChatBot([
                'user_id' => $userId,
                'history' => [
                    [
                        'role' => 'user',
                        'parts' => [['text' => $text]]
                    ]
                ]
            ]);

            // Save the chat to the database
            $chat->save();

            // Check if the user has an existing chat history
            $user = User::find($userId);
            $userChats = $user->chats;  // Assuming a `chats` relationship exists

            if (!$userChats->count()) {
                // If no previous chats, create a new user record for chats
                $user->chats()->create([
                    'chat_id' => $chat->id,
                    'title' => substr($text, 0, 40),
                ]);
            } else {
                // Add this chat to the existing user chats
                $user->chats()->create([
                    'chat_id' => $chat->id,
                    'title' => substr($text, 0, 40),
                ]);
            }

            return response()->json(['chat_id' => $chat->id], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating chat!'], 500);
        }
    }

    // Fetch all chats for the user
    public function getUserChats(Request $request)
    {
        $userId = $request->user()->id; // Get the currently authenticated user's ID

        try {
            $userChats = User::find($userId)->chats;
            return response()->json($userChats, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching user chats!'], 500);
        }
    }

    // Fetch a specific chat by ID
    public function getChatById(Request $request, $id)
    {
        $userId = $request->user()->id; // Get the currently authenticated user's ID

        try {
            $chat = ChatBot::where('id', $id)->where('user_id', $userId)->first();

            if (!$chat) {
                return response()->json(['message' => 'Chat not found!'], 404);
            }

            return response()->json($chat, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching chat!'], 500);
        }
    }

    // Update a chat's history
    public function updateChat(Request $request, $id)
    {
        $userId = $request->user()->id; // Get the currently authenticated user's ID
        $question = $request->input('question');
        $answer = $request->input('answer');

        $newItems = [
            ...(isset($question) ? [
                [
                    'role' => 'user',
                    'parts' => [['text' => $question]]
                ]
            ] : []),
            [
                'role' => 'model',
                'parts' => [['text' => $answer]]
            ]
        ];

        try {
            $chat = ChatBot::where('id', $id)->where('user_id', $userId)->first();

            if (!$chat) {
                return response()->json(['message' => 'Chat not found!'], 404);
            }

            // Update the chat history
            $chat->history = array_merge($chat->history, $newItems);
            $chat->save();

            return response()->json(['message' => 'Chat updated successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating chat!'], 500);
        }
    }
}

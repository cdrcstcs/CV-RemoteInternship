<?php
namespace App\Http\Controllers;

use App\Models\ChatBot;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ChatBotController extends Controller
{
    // Store a new chat
    public function storeChat(Request $request)
    {
        $userId = $request->user()->id;  // Get the currently authenticated user's ID
        $text = $request->input('text');

        // Log incoming request data
        Log::info('storeChat method called', ['user_id' => $userId, 'text' => $text]);

        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed', ['errors' => $validator->errors()]);
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
            $chat->save();

            Log::info('Chat created successfully', ['chat_id' => $chat->id]);

            return response()->json($chat);
        } catch (\Exception $e) {
            Log::error('Error creating chat', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error creating chat!'], 500);
        }
    }

    // Fetch all chats for the user
    public function getUserChats(Request $request)
    {
        $userId = $request->user()->id; // Get the currently authenticated user's ID

        // Log user chat fetching
        Log::info('Fetching user chats', ['user_id' => $userId]);

        try {
            $userChats = User::find($userId)->chats;
            Log::info('User chats fetched successfully', ['user_chats_count' => $userChats->count()]);
            return response()->json($userChats, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching user chats', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error fetching user chats!'], 500);
        }
    }

    // Fetch a specific chat by ID
    public function getChatById(Request $request, $id)
    {
        $userId = $request->user()->id; // Get the currently authenticated user's ID

        Log::info('Fetching chat by ID', ['user_id' => $userId, 'chat_id' => $id]);

        try {
            $chat = ChatBot::where('id', $id)->where('user_id', $userId)->first();

            if (!$chat) {
                Log::warning('Chat not found', ['chat_id' => $id]);
                return response()->json(['message' => 'Chat not found!'], 404);
            }

            Log::info('Chat fetched successfully', ['chat_id' => $id]);
            return response()->json($chat, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching chat', ['error' => $e->getMessage(), 'chat_id' => $id]);
            return response()->json(['message' => 'Error fetching chat!'], 500);
        }
    }

    // Update a chat's history
    public function updateChat(Request $request, $id)
    {
        $userId = $request->user()->id; // Get the currently authenticated user's ID
        $question = $request->input('question');
        $answer = $request->input('answer');

        Log::info('Updating chat history', ['user_id' => $userId, 'chat_id' => $id, 'question' => $question, 'answer' => $answer]);

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
                Log::warning('Chat not found', ['chat_id' => $id]);
                return response()->json(['message' => 'Chat not found!'], 404);
            }

            // Update the chat history
            $chat->history = array_merge($chat->history, $newItems);
            $chat->save();

            Log::info('Chat history updated successfully', ['chat_id' => $id]);
            return response()->json(['message' => 'Chat updated successfully!'], 200);
        } catch (\Exception $e) {
            Log::error('Error updating chat history', ['error' => $e->getMessage(), 'chat_id' => $id]);
            return response()->json(['message' => 'Error updating chat!'], 500);
        }
    }
}

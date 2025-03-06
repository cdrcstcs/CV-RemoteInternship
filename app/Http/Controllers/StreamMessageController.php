<?php

namespace App\Http\Controllers;

use App\Models\StreamMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // Add the Log facade for logging

class StreamMessageController extends Controller
{
    /**
     * Send a message to a viewer in a stream.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function sendMessage(Request $request)
    {
        // Log the incoming request data
        Log::info('sendMessage called', ['request' => $request->all()]);

        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:255',
            'creator_id' => 'required|exists:users,id',
            'viewer_id' => 'required|exists:users,id',
            'stream_id' => 'required|exists:streams,id',
        ]);

        // Log the validation status
        if ($validator->fails()) {
            Log::warning('sendMessage validation failed', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Log successful validation
        Log::info('sendMessage validation passed');

        // Create a new StreamMessage
        $streamMessage = StreamMessage::create([
            'message' => $request->message,
            'creator_id' => $request->creator_id,
            'viewer_id' => $request->viewer_id,
            'stream_id' => $request->stream_id,
        ]);

        $streamMessage = StreamMessage::with(['creator', 'viewer', 'stream'])->find($streamMessage->id);

        // Log the created message
        Log::info('sendMessage created new message', ['message' => $streamMessage]);

        // Return the created message
        return response()->json($streamMessage);
    }

    /**
     * Get all messages sent by a specific creator.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getMessagesByCreator(Request $request, $creatorId)
    {

        // Get all messages sent by the creator (creator_id)
        $messages = StreamMessage::where('creator_id', $creatorId)
        ->with(['creator', 'viewer'])  // Eager load both creator and viewer relationships
        ->get();
    
        // Log the retrieved messages
        Log::info('getMessagesByCreator retrieved messages', ['messages' => $messages]);

        // Return the retrieved messages
        return response()->json($messages);
    }
}

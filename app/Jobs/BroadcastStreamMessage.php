<?php
namespace App\Jobs;

use App\Events\StreamChatMessageSent;
use App\Models\StreamMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class BroadcastStreamMessage implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $streamMessage;

    /**
     * Create a new job instance.
     *
     * @param StreamMessage $streamMessage
     */
    public function __construct(StreamMessage $streamMessage)
    {
        $this->streamMessage = $streamMessage;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Broadcast the message
            broadcast(new StreamChatMessageSent($this->streamMessage));
            Log::info("Stream message broadcasted: {$this->streamMessage->id}");
        } catch (\Exception $e) {
            Log::error("Error broadcasting stream message: {$this->streamMessage->id}", ['error' => $e->getMessage()]);
        }
    }
}

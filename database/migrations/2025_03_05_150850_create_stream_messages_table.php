<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('stream_messages', function (Blueprint $table) {
            $table->id();
            $table->text('message');
            $table->foreignId('creator_id')->constrained('users');  // Creator of the message
            $table->foreignId('viewer_id')->constrained('users');   // Viewer of the message
            $table->foreignId('stream_id')->constrained('streams'); // Reference to the stream
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stream_messages');
    }
};

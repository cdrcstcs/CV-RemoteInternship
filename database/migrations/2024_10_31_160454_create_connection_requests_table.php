<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('connection_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // Foreign key for sender
            $table->foreignId('recipient_id')->constrained('users')->onDelete('cascade'); // Foreign key for recipient
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending'); // Correctly define enum column
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('connection_requests');
    }
};

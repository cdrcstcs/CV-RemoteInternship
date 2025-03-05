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
        Schema::create('stream_gifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users'); // Reference to users table (owner of the gift)
            $table->foreignId('stream_id')->nullable()->constrained('streams'); // Reference to the streams table
            $table->enum('gift_type', ['lion', 'flower', 'star', 'heart']); // Enum for gift types
            $table->decimal('price', 8, 2); // Adding price column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stream_gifts');
    }
};

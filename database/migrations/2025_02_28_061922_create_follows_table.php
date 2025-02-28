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
        Schema::create('follows', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->foreignId('follower_id')->constrained('users')->onDelete('cascade'); // Foreign key to users table
            $table->foreignId('following_id')->constrained('users')->onDelete('cascade'); // Foreign key to users table
            $table->timestamps();

            // Unique constraint to ensure one follow relationship between two users
            $table->unique(['follower_id', 'following_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};

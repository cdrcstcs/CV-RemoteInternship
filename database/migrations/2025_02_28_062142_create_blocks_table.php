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
        Schema::create('blocks', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->foreignId('blocker_id')->constrained('users')->onDelete('cascade'); // Foreign key to users table for blocker
            $table->foreignId('blocked_id')->constrained('users')->onDelete('cascade'); // Foreign key to users table for blocked
            $table->timestamps();

            // Unique constraint to ensure no duplicate block relationship between two users
            $table->unique(['blocker_id', 'blocked_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};

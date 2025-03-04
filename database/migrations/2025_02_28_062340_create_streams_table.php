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
        Schema::create('streams', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->string('ingressId')->nullable()->unique();
            $table->string('serverUrl')->nullable();
            $table->string('streamKey')->nullable();
            $table->boolean('isLive')->default(false);
            $table->boolean('isChatEnabled')->default(true);
            $table->boolean('isChatDelayed')->default(false);
            $table->boolean('isChatFollowersOnly')->default(false);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Foreign key to users table
            $table->timestamps(); // Created_at and updated_at columns
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('streams');
    }
};

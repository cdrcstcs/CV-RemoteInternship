<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipient_id')->constrained('users')->onDelete('cascade'); // Foreign key for recipient
            $table->string('type'); // Changed from enum to string
            $table->foreignId('related_user')->nullable()->constrained('users')->onDelete('set null'); // Foreign key for related user
            $table->foreignId('related_post')->nullable()->constrained('posts')->onDelete('set null'); // Foreign key for related post
            $table->boolean('read')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};

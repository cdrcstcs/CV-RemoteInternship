<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('connection_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Ensure that a user cannot connect to the same user more than once
            $table->unique(['user_id', 'connection_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_connections');
    }
};
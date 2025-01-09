<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();  // Automatically creates an 'id' column as primary key
            $table->unsignedBigInteger('users_id'); // Foreign key reference to 'users' table
            $table->string('address_line1');
            $table->string('address_line2')->nullable(); // Optional
            $table->string('city');
            $table->string('state');
            $table->string('postal_code');
            $table->string('country');
            $table->boolean('is_primary')->default(false); // Flag for primary address
            $table->timestamps(); // created_at and updated_at

            // Foreign key constraint
            $table->foreign('users_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_addresses');
    }
};

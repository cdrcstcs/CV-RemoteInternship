<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('location_histories', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade'); // Foreign key to vehicles table
            $table->string('location'); // Location (can store address or other descriptive text)
            $table->decimal('latitude', 10, 7); // Latitude for the location
            $table->decimal('longitude', 10, 7); // Longitude for the location
            $table->timestamp('timestamp')->nullable(); // Timestamp of when the location was logged

            $table->timestamps(); // CreatedAt and UpdatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('location_histories');
    }
};

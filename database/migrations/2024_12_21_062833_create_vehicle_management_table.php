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
        Schema::create('vehicle_management', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('location_history', 500)->nullable()->default(null);
            $table->decimal('fuel_consumption', 18, 2)->nullable()->default(null);
            $table->decimal('distance_traveled', 18, 2)->nullable()->default(null);
            $table->string('maintenance_status', 50)->nullable()->default(null);
            $table->timestamp('last_maintenance_date')->nullable()->default(null);
            $table->timestamp('maintenance_schedule')->nullable()->default(null);
            $table->decimal('maintenance_cost', 18, 2)->nullable()->default(null);
            $table->foreignId('users_id')->constrained('users')->onDelete('restrict')->onUpdate('cascade'); // Foreign key for the user
            $table->timestamps(); // CreatedAt and UpdatedAt

            $table->index('users_id'); // Index for the users_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_management');
    }
};

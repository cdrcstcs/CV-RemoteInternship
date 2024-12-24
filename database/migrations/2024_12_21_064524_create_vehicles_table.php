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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('license_plate', 50)->nullable(); // License plate
            $table->string('type', 50)->nullable(); // Type of vehicle (e.g., truck, sedan)
            $table->foreignId('driver_id')->nullable()->constrained('users'); // Foreign key to Users table for driver
            $table->decimal('capacity', 18, 2)->nullable(); // Capacity of the vehicle
            $table->decimal('fuel_capacity', 18, 2)->nullable(); // Fuel capacity
            $table->string('current_location', 500)->nullable(); // Current location
            $table->dateTime('last_serviced')->nullable(); // Last serviced date
            $table->string('status', 20)->nullable(); // Status (e.g., active, maintenance)
            $table->dateTime('last_fuel_refill')->nullable(); // Last fuel refill date
            $table->dateTime('last_location_update')->nullable(); // Last location update
            $table->decimal('mileage', 18, 2)->nullable(); // Mileage of the vehicle
            $table->string('maintenance_logs', 500)->nullable(); // Maintenance logs
            $table->foreignId('vehicle_management_id')->constrained('vehicle_management'); // Foreign key to VehicleManagement table
            
            $table->timestamps(); // CreatedAt and UpdatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
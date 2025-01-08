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
        Schema::create('routes', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('route_name', 255)->nullable(); // Name of the route
            $table->string('start_location', 500)->nullable(); // Starting point
            $table->string('end_location', 500)->nullable(); // Ending point
            $table->time('estimated_time')->nullable(); // Estimated travel time
            $table->decimal('distance', 18, 2)->nullable(); // Distance of the route
            $table->string('route_type', 50)->nullable(); // Type of route (e.g., highway, city road)
            $table->string('traffic_condition', 50)->nullable(); // Traffic condition (e.g., clear, congested)
            $table->string('route_status', 50)->nullable(); // Current status of the route (e.g., active, closed)
            $table->dateTime('last_optimized')->nullable(); // When the route was last optimized
            $table->foreignId('shipments_id')->constrained('shipments'); // Foreign key to Shipments table
            $table->foreignId('vehicles_id')->nullable()->constrained('vehicles'); // Foreign key to Vehicles table

            $table->timestamps(); // CreatedAt and UpdatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};

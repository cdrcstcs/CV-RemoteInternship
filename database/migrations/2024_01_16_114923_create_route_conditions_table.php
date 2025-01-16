<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_route_conditions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('route_conditions', function (Blueprint $table) {
            $table->id();  // Primary key
            $table->enum('weather', ['Clear', 'Rainy', 'Snowy', 'Foggy', 'Windy', 'Stormy'])->default('Clear');  // Weather conditions
            $table->enum('road_condition', ['Dry', 'Wet', 'Under Construction', 'Icy', 'Flooded'])->default('Dry');  // Road conditions
            $table->enum('traffic_condition', ['Light', 'Moderate', 'Heavy'])->default('Light');  // Traffic conditions
            $table->boolean('has_accident')->default(false);  // If there's an accident on the route
            $table->text('accident_description')->nullable();  // Detailed description of the accident, if any
            $table->text('road_closure_description')->nullable();  // Description of any road closure, if applicable
            $table->timestamp('reported_at')->useCurrent();  // Timestamp when the condition was reported
            $table->timestamps();  // Automatically manage created_at and updated_at

            // Optionally, you could add foreign key relationships if you want to link to other tables.
            // For example, if you wanted to associate route conditions with specific routes:
            // $table->unsignedBigInteger('route_id')->nullable();
            // $table->foreign('route_id')->references('id')->on('routes')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('route_conditions');
    }
};

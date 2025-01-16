<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRouteDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('route_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('route_optimization_id')->nullable(); // Make it nullable first
            $table->unsignedBigInteger('route_condition_id')->nullable(); // Foreign key to route_conditions table
            $table->string('route_name');
            $table->string('supplier_name')->nullable();
            $table->string('warehouse_name_1');
            $table->string('warehouse_name_2')->nullable();
            $table->string('start_location');
            $table->string('end_location');
            $table->dateTime('estimated_time');
            $table->decimal('start_latitude', 10, 7); // Latitude for the location
            $table->decimal('start_longitude', 10, 7); // Longitude for the location
            $table->decimal('end_latitude', 10, 7); // Latitude for the location
            $table->decimal('end_longitude', 10, 7); // Longitude for the location
            $table->float('distance');
            $table->timestamps();
            $table->foreign('route_condition_id')->references('id')->on('route_conditions')->onDelete('set null');
            $table->foreign('route_optimization_id')->references('id')->on('route_optimizations')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('route_details');
    }
}

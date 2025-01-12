<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRouteOptimizationsTable extends Migration
{
    public function up()
    {
        Schema::create('route_optimizations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shipments_id'); // Link to shipments table
            $table->float('total_distance');
            $table->timestamps();

            // Foreign key constraint for shipment
            $table->foreign('shipments_id')->references('id')->on('shipments')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('route_optimizations');
    }
}

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
            $table->string('route_name');
            $table->string('supplier_name')->nullable();
            $table->string('warehouse_name_1');
            $table->string('warehouse_name_2')->nullable();
            $table->float('distance');
            $table->timestamps();

            // Foreign key constraint for route_optimization_id
            $table->foreign('route_optimization_id')->references('id')->on('route_optimizations')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('route_details');
    }
}

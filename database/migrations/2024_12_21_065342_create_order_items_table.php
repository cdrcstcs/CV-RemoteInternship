<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();  // Auto-incrementing primary key (id)

            // Define foreign key columns first
            $table->unsignedBigInteger('orders_id');  // Foreign key referencing orders table
            $table->unsignedBigInteger('products_id');  // Foreign key referencing products table

            // Define other columns
            $table->integer('quantity')->nullable();  // Quantity
            $table->integer('total_amount')->nullable();  // Total amount (as string)

            // Define composite primary key
            // Define foreign keys
            $table->foreign('orders_id')
                ->references('id')->on('orders')
                ->onDelete('no action')
                ->onUpdate('no action');
                
            $table->foreign('products_id')
                ->references('id')->on('products')
                ->onDelete('no action')
                ->onUpdate('no action');

            // Add indexes for performance
            $table->index('orders_id');
            $table->index('products_id');

            // Timestamp columns (if you want to track creation and updates)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_items');
    }
};

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
        Schema::create('products_coupons', function (Blueprint $table) {
            $table->unsignedBigInteger('products_id');
            $table->unsignedBigInteger('coupons_id');
            $table->timestamps();

            // Define the composite primary key
            $table->primary(['products_id', 'coupons_id']);

            // Foreign key references
            $table->foreign('products_id')
                ->references('id')->on('products')
                ->onDelete('cascade'); // Cascade on delete

            $table->foreign('coupons_id')
                ->references('id')->on('coupons')
                ->onDelete('cascade'); // Cascade on delete

            // Optional: Indexing the foreign keys
            $table->index('products_id');
            $table->index('coupons_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products_coupons');
    }
};

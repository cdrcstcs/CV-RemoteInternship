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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id(); // Id for the coupon
            $table->string('discount', 45)->nullable(); // Discount value (can be percentage or fixed)
            $table->dateTime('expiration_date')->nullable(); // Expiration date for the coupon
            $table->timestamps(); // Timestamps for created_at and updated_at

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};

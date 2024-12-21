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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('status', 50)->nullable()->default(null);
            $table->dateTime('estimated_arrival')->nullable()->default(null);
            $table->dateTime('actual_arrival')->nullable()->default(null);
            $table->string('origin', 500)->nullable()->default(null);
            $table->string('destination', 500)->nullable()->default(null);
            $table->string('shipment_method', 50)->nullable()->default(null);
            $table->string('tracking_number', 100)->nullable()->unique();
            $table->dateTime('last_updated')->nullable()->default(null);
            $table->decimal('total_amount', 18, 2)->nullable()->default(null);
            $table->foreignId('providers_id')->constrained('providers'); // Foreign key to Providers table
            $table->foreignId('orders_id')->constrained('orders'); // Foreign key to Orders table


            $table->timestamps(); // CreatedAt and UpdatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};

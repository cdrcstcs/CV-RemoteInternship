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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('status', 30)->nullable()->default(null);
            $table->timestamp('order_date')->nullable()->default(null);
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Foreign key for the user
            $table->string('tracking_number', 100)->nullable()->unique();
            $table->timestamps(); // CreatedAt and UpdatedAt (CreatedAt, UpdatedAt)
            $table->integer('total_amount')->nullable()->default(null);

            // Indexes
            $table->index('user_id'); // Index for user_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

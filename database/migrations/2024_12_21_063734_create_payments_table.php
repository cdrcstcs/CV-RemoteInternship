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
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->decimal('total_amount', 18, 2)->nullable()->default(null); // Total amount of the payment
            $table->decimal('paid_amount', 18, 2)->nullable()->default(0.00); // Amount already paid
            $table->decimal('due_amount', 18, 2)->nullable()->default(null); // Remaining amount to be paid
            $table->string('payment_method', 50)->nullable()->default(null); // Method of payment
            $table->string('payment_status', 50)->nullable()->default(null); // Status of the payment (e.g., 'Completed', 'Pending')
            $table->timestamp('payment_date')->nullable()->default(null); // Date and time of payment
            $table->string('gateway', 100)->nullable()->default(null); // Payment gateway (e.g., PayPal, Stripe)
            $table->string('currency', 10)->nullable()->default(null); // Currency type (e.g., USD, EUR)
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete(); // Foreign key for the order
            $table->foreignId('providers_id')->constrained('providers')->onDelete('restrict')->onUpdate('cascade'); // Foreign key for the provider
            $table->timestamps(); // CreatedAt and UpdatedAt

            // Indexes
            $table->index('order_id'); // Index for order_id
            $table->index('providers_id'); // Index for providers_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

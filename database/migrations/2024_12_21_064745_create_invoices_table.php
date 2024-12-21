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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('customer_name', 45)->nullable(); // Customer name
            $table->dateTime('created_date')->nullable(); // Date when the invoice was created
            $table->string('payment_status', 45)->nullable(); // Payment status (e.g., 'paid', 'unpaid')
            $table->string('payment_method', 45)->nullable(); // Payment method (e.g., 'credit card', 'paypal')
            $table->string('description', 500)->nullable(); // Description of the invoice
            $table->decimal('shipping_cost', 18, 2)->nullable(); // Shipping cost
            $table->decimal('total_amount', 18, 2)->nullable(); // Total amount of the invoice
            $table->decimal('paid_amount', 18, 2)->nullable()->default(0); // Paid amount
            $table->decimal('due_amount', 18, 2)->nullable(); // Remaining due amount
            $table->string('currency', 10)->nullable(); // Currency for the invoice
            $table->decimal('discount', 18, 2)->nullable(); // Discount applied to the invoice
            $table->foreignId('payments_id')->constrained('payments'); // Foreign key to Payments table

            $table->timestamps(); // CreatedAt and UpdatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

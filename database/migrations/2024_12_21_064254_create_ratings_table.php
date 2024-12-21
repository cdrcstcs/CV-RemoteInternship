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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->integer('rating_value')->nullable()->default(null); // Rating value (e.g., 1-5)
            $table->string('feedback', 1000)->nullable()->default('No feedback provided'); // Feedback text
            $table->dateTime('date_created')->nullable()->default(null); // Date of rating creation
            $table->foreignId('shipments_id')->constrained('shipments'); // Foreign key to Shipments table
            $table->foreignId('products_id')->constrained('products'); // Foreign key to Products table


            $table->timestamps(); // CreatedAt and UpdatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};

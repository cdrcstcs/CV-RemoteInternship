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
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('name', 100)->nullable()->default(null);
            $table->decimal('price', 18, 2)->nullable()->default(null);
            $table->string('description', 500)->nullable()->default(null);
            $table->foreignId('supplier_id')->nullable()->constrained('users')->nullOnDelete(); // Foreign key for the supplier
            $table->boolean('isFeatured')->default(false); // Add the isFeatured column, default to false
            $table->string('image',1000)->nullable(); // Add image column as a string (nullable to allow missing images)

            $table->timestamps(); // CreatedAt and UpdatedAt (DateAdded, DateUpdated)

            $table->index('supplier_id'); // Index for supplier_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

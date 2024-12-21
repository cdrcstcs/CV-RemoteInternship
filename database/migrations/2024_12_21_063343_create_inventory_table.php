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
        Schema::create('inventory', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->integer('stock')->nullable()->default(null);
            $table->timestamp('last_updated')->nullable()->default(null);
            $table->decimal('weight_per_unit', 18, 2)->nullable()->default(null);
            $table->foreignId('products_id')->constrained('products')->onDelete('restrict')->onUpdate('cascade'); // Foreign key for the product
            $table->foreignId('warehouses_id')->constrained('warehouses')->onDelete('restrict')->onUpdate('cascade'); // Foreign key for the warehouse
            $table->timestamps(); // CreatedAt and UpdatedAt

            $table->index('products_id'); // Index for products_id
            $table->index('warehouses_id'); // Index for warehouses_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};

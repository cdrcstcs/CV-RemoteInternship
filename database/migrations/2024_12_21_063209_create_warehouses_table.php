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
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('warehouse_name', 45)->nullable()->default(null);
            $table->string('location', 500)->nullable()->default(null);
            $table->decimal('capacity', 18, 2)->nullable()->default(null);
            $table->decimal('available_space', 18, 2)->nullable()->default(null);
            $table->foreignId('users_id')->constrained('users')->onDelete('restrict')->onUpdate('cascade'); // Foreign key for the user
            $table->timestamps(); // CreatedAt and UpdatedAt

            $table->index('users_id'); // Index for users_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouses');
    }
};

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
        Schema::create('providers', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('type', 45)->nullable()->default(null); // Type of the provider
            $table->string('terms_of_service', 500)->nullable()->default(null); // Terms of service
            $table->timestamps(); // CreatedAt and UpdatedAt (CreatedAt, UpdatedAt)

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};

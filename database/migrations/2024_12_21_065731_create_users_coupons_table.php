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
        Schema::create('users_coupons', function (Blueprint $table) {
            $table->unsignedBigInteger('users_id');
            $table->unsignedBigInteger('coupons_id');
            $table->timestamps();

            // Define the composite primary key
            $table->primary(['users_id', 'coupons_id']);

            // Foreign key references
            $table->foreign('users_id')
                ->references('id')->on('users')
                ->onDelete('cascade'); // Cascade on delete

            $table->foreign('coupons_id')
                ->references('id')->on('coupons')
                ->onDelete('cascade'); // Cascade on delete

            // Optional: Indexing the foreign keys
            $table->index('users_id');
            $table->index('coupons_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_coupons');
    }
};

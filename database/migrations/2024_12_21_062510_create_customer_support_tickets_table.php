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
        Schema::create('customer_support_tickets', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Foreign key to 'users' table
            $table->string('issue_type', 50)->nullable()->default(null);
            $table->string('description', 500)->nullable()->default(null);
            $table->string('status', 50)->nullable()->default(null);
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete(); // Foreign key to 'users' table (Assigned user)
            $table->timestamps(); // CreatedAt and UpdatedAt
            $table->string('answer', 500)->nullable()->default(null);

            $table->index('user_id'); // Index for user_id
            $table->index('assigned_to'); // Index for assigned_to
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_support_tickets');
    }
};

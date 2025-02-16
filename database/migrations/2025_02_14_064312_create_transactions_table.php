<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('id')->unique(); // transaction id
            $table->string('name');
            $table->string('payment_channel');
            $table->string('type');
            $table->string('account_id');
            $table->decimal('amount', 15, 2);
            $table->boolean('pending');
            $table->string('category');
            $table->date('date');
            $table->string('image')->nullable();
            $table->string('channel');
            $table->string('sender_bank_id');
            $table->string('receiver_bank_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

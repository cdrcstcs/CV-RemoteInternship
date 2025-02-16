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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('id')->unique(); // account id
            $table->decimal('available_balance', 15, 2);
            $table->decimal('current_balance', 15, 2);
            $table->string('official_name');
            $table->string('mask');
            $table->string('institution_id');
            $table->string('name');
            $table->string('type');
            $table->string('subtype');
            $table->string('appwrite_item_id');
            $table->string('shareable_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};

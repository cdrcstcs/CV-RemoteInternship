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
        Schema::create('users_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('roles_id');
            $table->unsignedBigInteger('users_id');
            $table->primary(['roles_id', 'users_id']); // Composite primary key

            // Foreign keys
            $table->foreign('roles_id')
                ->references('id')->on('roles')
                ->onDelete('cascade') // Cascade delete if the role is deleted
                ->onUpdate('cascade');

            $table->foreign('users_id')
                ->references('id')->on('users')
                ->onDelete('cascade') // Cascade delete if the user is deleted
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_roles');
    }
};

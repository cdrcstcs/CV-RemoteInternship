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
        Schema::create('roles_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permissions_id');
            $table->unsignedBigInteger('roles_id');
            $table->primary(['permissions_id', 'roles_id']); // Composite primary key

            // Foreign keys
            $table->foreign('permissions_id')
                ->references('id')->on('permissions')
                ->onDelete('cascade') // Cascade delete if permission is deleted
                ->onUpdate('cascade');

            $table->foreign('roles_id')
                ->references('id')->on('roles')
                ->onDelete('cascade') // Cascade delete if role is deleted
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles_permissions');
    }
};

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
        // Create the 'users' table
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Automatically creates 'Id' as an auto-incrementing integer
            $table->string('first_name', 100)->nullable()->default(null);
            $table->string('last_name', 100)->nullable()->default(null);
            $table->string('phone_number', 50)->nullable()->default(null)->unique();
            $table->string('ip_address', 500)->nullable()->default(null);
            $table->string('email', 255)->nullable()->default(null)->unique();
            $table->string('password', 255)->nullable()->default(null);
            $table->boolean('two_factor_enabled')->default(false);
            $table->timestamp('last_login')->nullable()->default(null);
            $table->string('language', 20)->nullable()->default(null);
            $table->boolean('is_admin')->default(false);
            $table->timestamps(); // CreatedAt and UpdatedAt
            $table->timestamp('last_password_change')->nullable()->default(null);
            $table->string('profile_picture')->default('');
            $table->string('banner_img')->default('');
            $table->string('headline')->default('Linkedin User');
            $table->text('about')->nullable();
            
        });

        // Create 'password_reset_tokens' table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // 'email' as the primary key
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Create 'sessions' table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // 'id' as the primary key for session table
            $table->foreignId('user_id')->nullable()->constrained()->index(); // Foreign key for user_id, referencing 'users' table
            $table->string('ip_address', 45)->nullable(); // To store IPv6 addresses
            $table->text('user_agent')->nullable(); // To store the user's browser info
            $table->longText('payload'); // To store session payload data
            $table->integer('last_activity')->index(); // To store the timestamp of the last activity
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

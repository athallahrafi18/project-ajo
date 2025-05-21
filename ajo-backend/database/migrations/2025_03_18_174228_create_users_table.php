<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->unsignedBigInteger('role_id');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active'); // 🔹 Ditambahkan
            $table->timestamp('last_login')->nullable(); // 🔹 Ditambahkan
            $table->json('metadata')->nullable(); // 🔹 Ditambahkan
            $table->timestamps();

            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    public function down() {
        Schema::dropIfExists('users');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->timestamps();

            // Foreign key & unique constraint
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
            $table->unique(['name', 'parent_id']); // <-- ini gantikan unique(name)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

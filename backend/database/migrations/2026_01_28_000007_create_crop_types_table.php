<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 30)->unique();
            $table->string('scientific_name', 150)->nullable();
            $table->string('variety', 100)->nullable();
            $table->enum('category', ['grain', 'vegetable', 'fruit', 'legume', 'tuber', 'herb', 'flower', 'fodder', 'other']);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('typical_grow_duration_days')->nullable();
            $table->foreignId('default_yield_unit_id')->nullable()->constrained('units_of_measure')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_types');
    }
};

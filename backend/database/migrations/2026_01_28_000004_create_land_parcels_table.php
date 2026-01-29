<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('land_parcels', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 30)->unique();
            $table->text('description')->nullable();
            $table->enum('land_type', ['rice_field', 'garden', 'fish_pond', 'mixed', 'fallow', 'other']);
            $table->decimal('area_value', 10, 2);
            $table->foreignId('area_unit_id')->constrained('units_of_measure')->onDelete('restrict');
            $table->enum('terrain_type', ['flat', 'sloped', 'terraced', 'lowland'])->nullable();
            $table->enum('soil_type', ['clay', 'sandy', 'loamy', 'alluvial', 'mixed'])->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('land_type');
            $table->index('is_active');
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_parcels');
    }
};

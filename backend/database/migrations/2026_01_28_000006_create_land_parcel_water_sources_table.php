<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('land_parcel_water_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('land_parcel_id')->constrained('land_parcels')->onDelete('cascade');
            $table->foreignId('water_source_id')->constrained('water_sources')->onDelete('cascade');
            $table->enum('accessibility', ['direct', 'pumped', 'gravity_fed', 'manual'])->default('direct');
            $table->boolean('is_primary_source')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['land_parcel_id', 'water_source_id']);
            $table->index('is_primary_source');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_parcel_water_sources');
    }
};

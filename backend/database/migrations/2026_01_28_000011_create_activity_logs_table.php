<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_type_id')->constrained('activity_types')->onDelete('restrict');
            $table->foreignId('crop_cycle_id')->nullable()->constrained('crop_cycles')->onDelete('set null');
            $table->foreignId('land_parcel_id')->nullable()->constrained('land_parcels')->onDelete('set null');
            $table->foreignId('water_source_id')->nullable()->constrained('water_sources')->onDelete('set null');
            $table->date('activity_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->text('description')->nullable();
            $table->decimal('quantity_value', 12, 2)->nullable();
            $table->foreignId('quantity_unit_id')->nullable()->constrained('units_of_measure')->onDelete('set null');
            $table->decimal('cost_value', 12, 2)->nullable();
            $table->foreignId('cost_unit_id')->nullable()->constrained('units_of_measure')->onDelete('set null');
            $table->string('performed_by', 100)->nullable();
            $table->string('weather_conditions', 100)->nullable();
            $table->timestamps();

            $table->index('activity_date');
            $table->index(['land_parcel_id', 'activity_date']);
            $table->index(['crop_cycle_id', 'activity_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};

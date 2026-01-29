<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_cycles', function (Blueprint $table) {
            $table->id();
            $table->string('cycle_code', 50)->unique();
            $table->foreignId('land_parcel_id')->constrained('land_parcels')->onDelete('restrict');
            $table->foreignId('crop_type_id')->constrained('crop_types')->onDelete('restrict');
            $table->foreignId('season_id')->nullable()->constrained('seasons')->onDelete('set null');
            $table->enum('status', ['planned', 'active', 'completed', 'failed', 'abandoned'])->default('planned');
            $table->date('planned_start_date');
            $table->date('planned_end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('yield_value', 12, 2)->nullable();
            $table->foreignId('yield_unit_id')->nullable()->constrained('units_of_measure')->onDelete('set null');
            $table->enum('quality_rating', ['excellent', 'good', 'average', 'below_average', 'poor'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('planned_start_date');
            $table->index('planned_end_date');
            $table->index(['land_parcel_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_cycles');
    }
};

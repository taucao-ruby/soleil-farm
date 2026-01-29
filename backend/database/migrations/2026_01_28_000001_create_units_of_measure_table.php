<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units_of_measure', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('abbreviation', 20);
            $table->enum('unit_type', ['area', 'weight', 'volume', 'quantity', 'currency', 'time']);
            $table->decimal('conversion_factor_to_base', 15, 6)->default(1.000000);
            $table->boolean('is_base_unit')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['name', 'unit_type']);
            $table->index('unit_type');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units_of_measure');
    }
};

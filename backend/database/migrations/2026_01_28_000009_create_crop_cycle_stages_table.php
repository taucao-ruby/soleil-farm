<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_cycle_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crop_cycle_id')->constrained('crop_cycles')->onDelete('cascade');
            $table->string('stage_name', 100);
            $table->unsignedSmallInteger('sequence_order');
            $table->date('planned_start_date')->nullable();
            $table->date('planned_end_date')->nullable();
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'skipped'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['crop_cycle_id', 'sequence_order']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_cycle_stages');
    }
};

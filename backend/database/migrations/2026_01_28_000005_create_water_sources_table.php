<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('water_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 30)->unique();
            $table->enum('source_type', ['well', 'river', 'stream', 'pond', 'irrigation_canal', 'rainwater', 'municipal']);
            $table->text('description')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('reliability', ['permanent', 'seasonal', 'intermittent'])->default('permanent');
            $table->enum('water_quality', ['excellent', 'good', 'fair', 'poor'])->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('source_type');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('water_sources');
    }
};

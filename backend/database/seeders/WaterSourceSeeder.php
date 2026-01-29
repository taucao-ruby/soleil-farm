<?php

namespace Database\Seeders;

use App\Models\WaterSource;
use Illuminate\Database\Seeder;

class WaterSourceSeeder extends Seeder
{
    public function run(): void
    {
        $sources = [
            [
                'name' => 'Suối Đá',
                'code' => 'SUOI-DA-01',
                'source_type' => 'stream',
                'description' => 'Suối tự nhiên chảy quanh năm từ núi',
                'latitude' => 16.7495,
                'longitude' => 106.7995,
                'reliability' => 'permanent',
                'water_quality' => 'good',
            ],
            [
                'name' => 'Giếng khoan nhà',
                'code' => 'GIENG-NHA-01',
                'source_type' => 'well',
                'description' => 'Giếng khoan sâu 30m, nước ngọt',
                'latitude' => 16.7505,
                'longitude' => 106.8005,
                'reliability' => 'permanent',
                'water_quality' => 'excellent',
            ],
            [
                'name' => 'Kênh thủy lợi',
                'code' => 'KENH-TL-01',
                'source_type' => 'irrigation_canal',
                'description' => 'Kênh thủy lợi của xã, có nước theo mùa vụ',
                'latitude' => 16.7520,
                'longitude' => 106.8020,
                'reliability' => 'seasonal',
                'water_quality' => 'fair',
            ],
            [
                'name' => 'Bể chứa nước mưa',
                'code' => 'BE-MUA-01',
                'source_type' => 'rainwater',
                'description' => 'Bể xi măng chứa nước mưa 5m³',
                'latitude' => 16.7506,
                'longitude' => 106.8006,
                'reliability' => 'seasonal',
                'water_quality' => 'good',
            ],
        ];

        foreach ($sources as $source) {
            WaterSource::create($source);
        }
    }
}

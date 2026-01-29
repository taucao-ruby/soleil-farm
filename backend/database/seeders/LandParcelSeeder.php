<?php

namespace Database\Seeders;

use App\Models\LandParcel;
use App\Models\UnitOfMeasure;
use Illuminate\Database\Seeder;

class LandParcelSeeder extends Seeder
{
    public function run(): void
    {
        $saoUnit = UnitOfMeasure::where('abbreviation', 'sào')->first();
        $m2Unit = UnitOfMeasure::where('abbreviation', 'm²')->first();

        $parcels = [
            [
                'name' => 'Ruộng Đồng Trước',
                'code' => 'DONG-TRUOC-01',
                'description' => 'Ruộng lúa nước phía trước nhà, gần suối',
                'land_type' => 'rice_field',
                'area_value' => 3,
                'area_unit_id' => $saoUnit?->id ?? $m2Unit?->id,
                'terrain_type' => 'lowland',
                'soil_type' => 'alluvial',
                'latitude' => 16.7500,
                'longitude' => 106.8000,
            ],
            [
                'name' => 'Ruộng Đồng Sau',
                'code' => 'DONG-SAU-01',
                'description' => 'Ruộng lúa nước phía sau nhà',
                'land_type' => 'rice_field',
                'area_value' => 2.5,
                'area_unit_id' => $saoUnit?->id ?? $m2Unit?->id,
                'terrain_type' => 'lowland',
                'soil_type' => 'clay',
                'latitude' => 16.7510,
                'longitude' => 106.8010,
            ],
            [
                'name' => 'Vườn nhà',
                'code' => 'VUON-NHA-01',
                'description' => 'Vườn rau và cây ăn quả quanh nhà',
                'land_type' => 'garden',
                'area_value' => 500,
                'area_unit_id' => $m2Unit?->id,
                'terrain_type' => 'flat',
                'soil_type' => 'loamy',
                'latitude' => 16.7505,
                'longitude' => 106.8005,
            ],
            [
                'name' => 'Ao cá',
                'code' => 'AO-CA-01',
                'description' => 'Ao nuôi cá nước ngọt',
                'land_type' => 'fish_pond',
                'area_value' => 200,
                'area_unit_id' => $m2Unit?->id,
                'terrain_type' => 'lowland',
                'soil_type' => 'clay',
                'latitude' => 16.7508,
                'longitude' => 106.8002,
            ],
        ];

        foreach ($parcels as $parcel) {
            LandParcel::create($parcel);
        }
    }
}

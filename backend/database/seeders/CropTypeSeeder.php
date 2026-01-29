<?php

namespace Database\Seeders;

use App\Models\CropType;
use App\Models\UnitOfMeasure;
use Illuminate\Database\Seeder;

class CropTypeSeeder extends Seeder
{
    public function run(): void
    {
        $kgUnit = UnitOfMeasure::where('abbreviation', 'kg')->first();

        $crops = [
            [
                'name' => 'Lúa OM5451',
                'code' => 'LUA-OM5451',
                'scientific_name' => 'Oryza sativa',
                'variety' => 'OM5451',
                'category' => 'grain',
                'description' => 'Giống lúa chất lượng cao, thơm nhẹ, năng suất ổn định',
                'typical_grow_duration_days' => 105,
                'default_yield_unit_id' => $kgUnit?->id,
            ],
            [
                'name' => 'Lúa ST25',
                'code' => 'LUA-ST25',
                'scientific_name' => 'Oryza sativa',
                'variety' => 'ST25',
                'category' => 'grain',
                'description' => 'Giống lúa ngon nhất thế giới 2019',
                'typical_grow_duration_days' => 110,
                'default_yield_unit_id' => $kgUnit?->id,
            ],
            [
                'name' => 'Lúa Khang Dân',
                'code' => 'LUA-KD18',
                'scientific_name' => 'Oryza sativa',
                'variety' => 'Khang Dân 18',
                'category' => 'grain',
                'description' => 'Giống lúa phổ biến miền Trung',
                'typical_grow_duration_days' => 100,
                'default_yield_unit_id' => $kgUnit?->id,
            ],
            [
                'name' => 'Rau muống',
                'code' => 'RAU-MUONG',
                'scientific_name' => 'Ipomoea aquatica',
                'variety' => null,
                'category' => 'vegetable',
                'description' => 'Rau muống nước',
                'typical_grow_duration_days' => 30,
                'default_yield_unit_id' => $kgUnit?->id,
            ],
            [
                'name' => 'Đậu phộng',
                'code' => 'DAU-PHONG',
                'scientific_name' => 'Arachis hypogaea',
                'variety' => null,
                'category' => 'legume',
                'description' => 'Đậu phộng (lạc)',
                'typical_grow_duration_days' => 120,
                'default_yield_unit_id' => $kgUnit?->id,
            ],
            [
                'name' => 'Khoai lang',
                'code' => 'KHOAI-LANG',
                'scientific_name' => 'Ipomoea batatas',
                'variety' => 'Nhật tím',
                'category' => 'tuber',
                'description' => 'Khoai lang Nhật tím',
                'typical_grow_duration_days' => 120,
                'default_yield_unit_id' => $kgUnit?->id,
            ],
        ];

        foreach ($crops as $crop) {
            CropType::create($crop);
        }
    }
}

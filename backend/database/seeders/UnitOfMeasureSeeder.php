<?php

namespace Database\Seeders;

use App\Models\UnitOfMeasure;
use Illuminate\Database\Seeder;

class UnitOfMeasureSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // Area units
            ['name' => 'Mét vuông', 'abbreviation' => 'm²', 'unit_type' => 'area', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'Sào (Bắc)', 'abbreviation' => 'sào', 'unit_type' => 'area', 'conversion_factor_to_base' => 360, 'is_base_unit' => false],
            ['name' => 'Công (Nam)', 'abbreviation' => 'công', 'unit_type' => 'area', 'conversion_factor_to_base' => 1000, 'is_base_unit' => false],
            ['name' => 'Hecta', 'abbreviation' => 'ha', 'unit_type' => 'area', 'conversion_factor_to_base' => 10000, 'is_base_unit' => false],

            // Weight units
            ['name' => 'Kilogram', 'abbreviation' => 'kg', 'unit_type' => 'weight', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'Tạ', 'abbreviation' => 'tạ', 'unit_type' => 'weight', 'conversion_factor_to_base' => 100, 'is_base_unit' => false],
            ['name' => 'Tấn', 'abbreviation' => 'tấn', 'unit_type' => 'weight', 'conversion_factor_to_base' => 1000, 'is_base_unit' => false],
            ['name' => 'Yến', 'abbreviation' => 'yến', 'unit_type' => 'weight', 'conversion_factor_to_base' => 10, 'is_base_unit' => false],

            // Volume units
            ['name' => 'Lít', 'abbreviation' => 'L', 'unit_type' => 'volume', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'Mét khối', 'abbreviation' => 'm³', 'unit_type' => 'volume', 'conversion_factor_to_base' => 1000, 'is_base_unit' => false],

            // Currency
            ['name' => 'Việt Nam Đồng', 'abbreviation' => 'VNĐ', 'unit_type' => 'currency', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],

            // Quantity
            ['name' => 'Cái', 'abbreviation' => 'cái', 'unit_type' => 'quantity', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'Bó', 'abbreviation' => 'bó', 'unit_type' => 'quantity', 'conversion_factor_to_base' => 1, 'is_base_unit' => false],
            ['name' => 'Bao', 'abbreviation' => 'bao', 'unit_type' => 'quantity', 'conversion_factor_to_base' => 1, 'is_base_unit' => false],

            // Time
            ['name' => 'Giờ', 'abbreviation' => 'giờ', 'unit_type' => 'time', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'Ngày công', 'abbreviation' => 'ngày', 'unit_type' => 'time', 'conversion_factor_to_base' => 8, 'is_base_unit' => false],
        ];

        foreach ($units as $unit) {
            UnitOfMeasure::create($unit);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\SeasonDefinition;
use Illuminate\Database\Seeder;

class SeasonDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        $seasons = [
            [
                'name' => 'Vụ Đông-Xuân',
                'code' => 'DONG-XUAN',
                'description' => 'Vụ lúa chính, gieo cấy từ tháng 11-12, thu hoạch tháng 4-5',
                'typical_start_month' => 11,
                'typical_end_month' => 5,
            ],
            [
                'name' => 'Vụ Hè-Thu',
                'code' => 'HE-THU',
                'description' => 'Vụ lúa thứ hai, gieo cấy từ tháng 5-6, thu hoạch tháng 8-9',
                'typical_start_month' => 5,
                'typical_end_month' => 9,
            ],
            [
                'name' => 'Vụ Mùa',
                'code' => 'VU-MUA',
                'description' => 'Vụ lúa mùa mưa, gieo cấy tháng 6-7, thu hoạch tháng 10-11',
                'typical_start_month' => 6,
                'typical_end_month' => 11,
            ],
        ];

        foreach ($seasons as $season) {
            SeasonDefinition::create($season);
        }
    }
}

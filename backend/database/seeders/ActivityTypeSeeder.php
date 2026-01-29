<?php

namespace Database\Seeders;

use App\Models\ActivityType;
use Illuminate\Database\Seeder;

class ActivityTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            // Land preparation
            ['name' => 'Cày đất', 'code' => 'CAY-DAT', 'category' => 'land_preparation', 'description' => 'Cày xới đất chuẩn bị gieo trồng'],
            ['name' => 'Bừa đất', 'code' => 'BUA-DAT', 'category' => 'land_preparation', 'description' => 'Bừa làm tơi đất'],
            ['name' => 'San phẳng ruộng', 'code' => 'SAN-RUONG', 'category' => 'land_preparation', 'description' => 'San phẳng mặt ruộng'],

            // Planting
            ['name' => 'Gieo mạ', 'code' => 'GIEO-MA', 'category' => 'planting', 'description' => 'Gieo hạt giống làm mạ'],
            ['name' => 'Cấy lúa', 'code' => 'CAY-LUA', 'category' => 'planting', 'description' => 'Cấy mạ ra ruộng'],
            ['name' => 'Trồng cây', 'code' => 'TRONG-CAY', 'category' => 'planting', 'description' => 'Trồng cây con ra vườn'],
            ['name' => 'Gieo hạt', 'code' => 'GIEO-HAT', 'category' => 'planting', 'description' => 'Gieo hạt giống trực tiếp'],

            // Irrigation
            ['name' => 'Tưới nước', 'code' => 'TUOI-NUOC', 'category' => 'irrigation', 'description' => 'Tưới nước cho cây trồng'],
            ['name' => 'Bơm nước', 'code' => 'BOM-NUOC', 'category' => 'irrigation', 'description' => 'Bơm nước vào ruộng'],
            ['name' => 'Tháo nước', 'code' => 'THAO-NUOC', 'category' => 'irrigation', 'description' => 'Tháo nước khỏi ruộng'],

            // Fertilizing
            ['name' => 'Bón phân đạm', 'code' => 'BON-DAM', 'category' => 'fertilizing', 'description' => 'Bón phân đạm (N)'],
            ['name' => 'Bón phân lân', 'code' => 'BON-LAN', 'category' => 'fertilizing', 'description' => 'Bón phân lân (P)'],
            ['name' => 'Bón phân kali', 'code' => 'BON-KALI', 'category' => 'fertilizing', 'description' => 'Bón phân kali (K)'],
            ['name' => 'Bón phân NPK', 'code' => 'BON-NPK', 'category' => 'fertilizing', 'description' => 'Bón phân tổng hợp NPK'],
            ['name' => 'Bón phân hữu cơ', 'code' => 'BON-HUU-CO', 'category' => 'fertilizing', 'description' => 'Bón phân chuồng, compost'],

            // Pest control
            ['name' => 'Phun thuốc sâu', 'code' => 'PHUN-SAU', 'category' => 'pest_control', 'description' => 'Phun thuốc trừ sâu'],
            ['name' => 'Phun thuốc bệnh', 'code' => 'PHUN-BENH', 'category' => 'pest_control', 'description' => 'Phun thuốc trừ bệnh'],
            ['name' => 'Diệt cỏ', 'code' => 'DIET-CO', 'category' => 'pest_control', 'description' => 'Phun thuốc diệt cỏ hoặc làm cỏ tay'],
            ['name' => 'Bắt sâu tay', 'code' => 'BAT-SAU', 'category' => 'pest_control', 'description' => 'Bắt sâu bằng tay'],

            // Harvesting
            ['name' => 'Thu hoạch', 'code' => 'THU-HOACH', 'category' => 'harvesting', 'description' => 'Thu hoạch sản phẩm'],
            ['name' => 'Gặt lúa', 'code' => 'GAT-LUA', 'category' => 'harvesting', 'description' => 'Gặt lúa bằng máy hoặc tay'],
            ['name' => 'Phơi khô', 'code' => 'PHOI-KHO', 'category' => 'harvesting', 'description' => 'Phơi khô sản phẩm sau thu hoạch'],

            // Maintenance
            ['name' => 'Sửa bờ ruộng', 'code' => 'SUA-BO', 'category' => 'maintenance', 'description' => 'Sửa chữa bờ ruộng'],
            ['name' => 'Nạo vét mương', 'code' => 'NAO-MUONG', 'category' => 'maintenance', 'description' => 'Nạo vét kênh mương'],

            // Observation
            ['name' => 'Kiểm tra ruộng', 'code' => 'KIEM-TRA', 'category' => 'observation', 'description' => 'Đi thăm đồng, kiểm tra tình hình'],
            ['name' => 'Đánh giá sâu bệnh', 'code' => 'DANH-GIA-SB', 'category' => 'observation', 'description' => 'Đánh giá mức độ sâu bệnh'],
        ];

        foreach ($types as $type) {
            ActivityType::create($type);
        }
    }
}

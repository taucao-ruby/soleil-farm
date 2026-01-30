<?php

namespace Database\Factories;

use App\Models\ActivityType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for ActivityType model.
 *
 * Định nghĩa các loại hoạt động nông nghiệp tại Việt Nam.
 * Phân loại: chuẩn bị đất, gieo trồng, chăm sóc, thu hoạch.
 *
 * @extends Factory<ActivityType>
 */
class ActivityTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ActivityType>
     */
    protected $model = ActivityType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $activities = [
            // Chuẩn bị đất
            [
                'name' => 'Cày bừa',
                'code' => 'CAY_BUA',
                'category' => 'land_preparation',
                'description' => 'Cày xới và bừa đất để chuẩn bị gieo trồng',
            ],
            [
                'name' => 'Làm đất',
                'code' => 'LAM_DAT',
                'category' => 'land_preparation',
                'description' => 'San phẳng, lên luống, chuẩn bị đất trồng',
            ],
            [
                'name' => 'Bón lót',
                'code' => 'BON_LOT',
                'category' => 'land_preparation',
                'description' => 'Bón phân lót trước khi gieo trồng',
            ],
            // Gieo trồng
            [
                'name' => 'Gieo hạt',
                'code' => 'GIEO_HAT',
                'category' => 'planting',
                'description' => 'Gieo hạt giống trực tiếp xuống đất',
            ],
            [
                'name' => 'Trồng cây con',
                'code' => 'TRONG_CAY_CON',
                'category' => 'planting',
                'description' => 'Trồng cây con đã ươm sẵn',
            ],
            [
                'name' => 'Cấy lúa',
                'code' => 'CAY_LUA',
                'category' => 'planting',
                'description' => 'Cấy mạ lúa ra ruộng',
            ],
            // Chăm sóc
            [
                'name' => 'Tưới nước',
                'code' => 'TUOI_NUOC',
                'category' => 'maintenance',
                'description' => 'Tưới nước cho cây trồng',
            ],
            [
                'name' => 'Bón phân',
                'code' => 'BON_PHAN',
                'category' => 'maintenance',
                'description' => 'Bón phân thúc cho cây trồng',
            ],
            [
                'name' => 'Phun thuốc BVTV',
                'code' => 'PHUN_THUOC',
                'category' => 'maintenance',
                'description' => 'Phun thuốc bảo vệ thực vật phòng trừ sâu bệnh',
            ],
            [
                'name' => 'Làm cỏ',
                'code' => 'LAM_CO',
                'category' => 'maintenance',
                'description' => 'Nhổ cỏ, làm sạch ruộng',
            ],
            [
                'name' => 'Tỉa cành',
                'code' => 'TIA_CANH',
                'category' => 'maintenance',
                'description' => 'Tỉa cành, tạo tán cho cây',
            ],
            [
                'name' => 'Bấm ngọn',
                'code' => 'BAM_NGON',
                'category' => 'maintenance',
                'description' => 'Bấm ngọn để cây ra nhánh',
            ],
            // Thu hoạch
            [
                'name' => 'Thu hoạch',
                'code' => 'THU_HOACH',
                'category' => 'harvesting',
                'description' => 'Thu hoạch sản phẩm',
            ],
            [
                'name' => 'Gặt lúa',
                'code' => 'GAT_LUA',
                'category' => 'harvesting',
                'description' => 'Gặt lúa bằng máy hoặc thủ công',
            ],
            [
                'name' => 'Phơi sấy',
                'code' => 'PHOI_SAY',
                'category' => 'harvesting',
                'description' => 'Phơi hoặc sấy nông sản sau thu hoạch',
            ],
            // Khác
            [
                'name' => 'Kiểm tra đồng ruộng',
                'code' => 'KIEM_TRA',
                'category' => 'observation',
                'description' => 'Kiểm tra tình trạng cây trồng, sâu bệnh',
            ],
            [
                'name' => 'Bảo trì thiết bị',
                'code' => 'BAO_TRI',
                'category' => 'other',
                'description' => 'Bảo trì, sửa chữa máy móc thiết bị',
            ],
        ];

        $activity = fake()->randomElement($activities);

        return [
            'name' => $activity['name'],
            'code' => $activity['code'] . '_' . fake()->unique()->numerify('###'),
            'category' => $activity['category'],
            'description' => $activity['description'],
            'is_active' => true,
        ];
    }

    /**
     * Hoạt động chuẩn bị đất.
     */
    public function landPreparation(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Cày bừa', 'Làm đất', 'Bón lót']),
            'category' => 'land_preparation',
        ]);
    }

    /**
     * Hoạt động gieo trồng.
     */
    public function planting(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Gieo hạt', 'Trồng cây con', 'Cấy lúa']),
            'code' => 'PLANTING_' . fake()->unique()->numerify('###'),
            'category' => 'planting',
        ]);
    }

    /**
     * Hoạt động chăm sóc.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Tưới nước', 'Bón phân', 'Phun thuốc BVTV', 'Làm cỏ']),
            'code' => 'MAINTENANCE_' . fake()->unique()->numerify('###'),
            'category' => 'maintenance',
        ]);
    }

    /**
     * Hoạt động thu hoạch.
     */
    public function harvesting(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Thu hoạch', 'Gặt lúa', 'Phơi sấy']),
            'code' => 'HARVESTING_' . fake()->unique()->numerify('###'),
            'category' => 'harvesting',
        ]);
    }

    /**
     * Tưới nước.
     */
    public function irrigation(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Tưới nước',
            'code' => 'TUOI_NUOC_' . fake()->unique()->numerify('###'),
            'category' => 'maintenance',
            'description' => 'Tưới nước cho cây trồng',
        ]);
    }

    /**
     * Bón phân.
     */
    public function fertilizing(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Bón phân',
            'code' => 'BON_PHAN_' . fake()->unique()->numerify('###'),
            'category' => 'maintenance',
            'description' => 'Bón phân thúc cho cây trồng',
        ]);
    }

    /**
     * Phun thuốc.
     */
    public function spraying(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Phun thuốc BVTV',
            'code' => 'PHUN_THUOC_' . fake()->unique()->numerify('###'),
            'category' => 'maintenance',
            'description' => 'Phun thuốc bảo vệ thực vật phòng trừ sâu bệnh',
        ]);
    }

    /**
     * Hoạt động không còn hoạt động.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

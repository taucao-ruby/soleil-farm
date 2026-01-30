<?php

namespace Database\Factories;

use App\Models\CropCycle;
use App\Models\CropCycleStage;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for CropCycleStage model.
 *
 * Tạo các giai đoạn canh tác trong vụ mùa.
 * Các giai đoạn: chuẩn bị, gieo trồng, chăm sóc, thu hoạch.
 *
 * @extends Factory<CropCycleStage>
 */
class CropCycleStageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<CropCycleStage>
     */
    protected $model = CropCycleStage::class;

    /**
     * Counter for sequence order within a crop cycle.
     */
    protected static int $sequenceCounter = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $stages = [
            [
                'stage_name' => 'Chuẩn bị đất',
                'description' => 'Cày bừa, làm đất, bón lót',
                'duration_days' => 7,
            ],
            [
                'stage_name' => 'Gieo trồng',
                'description' => 'Gieo hạt hoặc trồng cây con',
                'duration_days' => 3,
            ],
            [
                'stage_name' => 'Nảy mầm/Bén rễ',
                'description' => 'Giai đoạn cây bắt đầu phát triển',
                'duration_days' => 10,
            ],
            [
                'stage_name' => 'Sinh trưởng',
                'description' => 'Cây phát triển thân lá',
                'duration_days' => 30,
            ],
            [
                'stage_name' => 'Ra hoa',
                'description' => 'Giai đoạn cây ra hoa',
                'duration_days' => 14,
            ],
            [
                'stage_name' => 'Kết trái/Chín',
                'description' => 'Quả phát triển và chín',
                'duration_days' => 21,
            ],
            [
                'stage_name' => 'Thu hoạch',
                'description' => 'Thu hoạch sản phẩm',
                'duration_days' => 7,
            ],
        ];

        $stage = fake()->randomElement($stages);
        $startDate = fake()->dateTimeBetween('-30 days', '+30 days');
        $endDate = Carbon::parse($startDate)->addDays($stage['duration_days']);

        return [
            'crop_cycle_id' => CropCycle::factory(),
            'stage_name' => $stage['stage_name'],
            'sequence_order' => fake()->numberBetween(1, 7),
            'planned_start_date' => $startDate,
            'planned_end_date' => $endDate,
            'actual_start_date' => null,
            'actual_end_date' => null,
            'status' => 'pending',
            'notes' => fake()->optional(0.4)->sentence(),
        ];
    }

    /**
     * Giai đoạn đang chờ.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'actual_start_date' => null,
            'actual_end_date' => null,
        ]);
    }

    /**
     * Giai đoạn đang tiến hành.
     */
    public function inProgress(): static
    {
        $startDate = fake()->dateTimeBetween('-14 days', '-1 day');

        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
            'actual_start_date' => $startDate,
            'actual_end_date' => null,
            'notes' => fake()->optional(0.5)->randomElement([
                'Đang tiến hành theo kế hoạch',
                'Tiến độ tốt, dự kiến hoàn thành đúng hạn',
                'Cần thêm nhân công để hoàn thành',
            ]),
        ]);
    }

    /**
     * Giai đoạn đã hoàn thành.
     */
    public function completed(): static
    {
        $startDate = fake()->dateTimeBetween('-30 days', '-14 days');
        $endDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(3, 14));

        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'actual_start_date' => $startDate,
            'actual_end_date' => $endDate,
            'notes' => fake()->optional(0.5)->randomElement([
                'Hoàn thành đúng tiến độ',
                'Hoàn thành sớm hơn dự kiến',
                'Hoàn thành với chất lượng tốt',
            ]),
        ]);
    }

    /**
     * Giai đoạn bị bỏ qua.
     */
    public function skipped(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'skipped',
            'actual_start_date' => null,
            'actual_end_date' => null,
            'notes' => fake()->randomElement([
                'Bỏ qua do không cần thiết',
                'Gộp chung với giai đoạn khác',
                'Điều kiện không phù hợp',
            ]),
        ]);
    }

    /**
     * Giai đoạn chuẩn bị đất.
     */
    public function landPreparation(): static
    {
        return $this->state(fn (array $attributes) => [
            'stage_name' => 'Chuẩn bị đất',
            'sequence_order' => 1,
            'notes' => fake()->optional(0.5)->randomElement([
                'Cày sâu 20cm, bừa kỹ',
                'Bón lót phân chuồng 2 tấn/ha',
                'San phẳng mặt ruộng',
            ]),
        ]);
    }

    /**
     * Giai đoạn gieo trồng.
     */
    public function planting(): static
    {
        return $this->state(fn (array $attributes) => [
            'stage_name' => 'Gieo trồng',
            'sequence_order' => 2,
            'notes' => fake()->optional(0.5)->randomElement([
                'Gieo hạt đều, mật độ 120kg/ha',
                'Trồng cây con khỏe mạnh',
                'Cấy mạ 18-20 ngày tuổi',
            ]),
        ]);
    }

    /**
     * Giai đoạn sinh trưởng.
     */
    public function growing(): static
    {
        return $this->state(fn (array $attributes) => [
            'stage_name' => 'Sinh trưởng',
            'sequence_order' => 4,
            'notes' => fake()->optional(0.5)->randomElement([
                'Cây phát triển tốt',
                'Bón thúc đợt 1 sau 20 ngày',
                'Theo dõi sâu bệnh hàng tuần',
            ]),
        ]);
    }

    /**
     * Giai đoạn ra hoa.
     */
    public function flowering(): static
    {
        return $this->state(fn (array $attributes) => [
            'stage_name' => 'Ra hoa',
            'sequence_order' => 5,
            'notes' => fake()->optional(0.5)->randomElement([
                'Hoa nở đều, thụ phấn tốt',
                'Tưới đủ nước giai đoạn này',
                'Phun thuốc phòng bệnh',
            ]),
        ]);
    }

    /**
     * Giai đoạn thu hoạch.
     */
    public function harvesting(): static
    {
        return $this->state(fn (array $attributes) => [
            'stage_name' => 'Thu hoạch',
            'sequence_order' => 7,
            'notes' => fake()->optional(0.5)->randomElement([
                'Thu hoạch khi độ chín đạt 90%',
                'Phơi khô ngay sau thu hoạch',
                'Bảo quản nơi khô ráo',
            ]),
        ]);
    }

    /**
     * Tạo chuỗi giai đoạn hoàn chỉnh cho vụ lúa.
     */
    public function riceStages(CropCycle $cropCycle): array
    {
        $stages = [
            ['name' => 'Chuẩn bị đất', 'duration' => 7, 'status' => 'completed'],
            ['name' => 'Gieo mạ', 'duration' => 18, 'status' => 'completed'],
            ['name' => 'Cấy lúa', 'duration' => 5, 'status' => 'completed'],
            ['name' => 'Đẻ nhánh', 'duration' => 25, 'status' => 'in_progress'],
            ['name' => 'Làm đòng', 'duration' => 20, 'status' => 'pending'],
            ['name' => 'Trổ bông', 'duration' => 10, 'status' => 'pending'],
            ['name' => 'Chín', 'duration' => 25, 'status' => 'pending'],
            ['name' => 'Thu hoạch', 'duration' => 7, 'status' => 'pending'],
        ];

        $currentDate = Carbon::parse($cropCycle->planned_start_date);
        $result = [];

        foreach ($stages as $index => $stage) {
            $startDate = $currentDate->copy();
            $endDate = $currentDate->addDays($stage['duration']);

            $result[] = static::new()->state([
                'crop_cycle_id' => $cropCycle->id,
                'stage_name' => $stage['name'],
                'sequence_order' => $index + 1,
                'planned_start_date' => $startDate,
                'planned_end_date' => $endDate,
                'status' => $stage['status'],
                'actual_start_date' => $stage['status'] !== 'pending' ? $startDate : null,
                'actual_end_date' => $stage['status'] === 'completed' ? $endDate : null,
            ]);
        }

        return $result;
    }

    /**
     * Tạo chuỗi giai đoạn cho rau.
     */
    public function vegetableStages(CropCycle $cropCycle): array
    {
        $stages = [
            ['name' => 'Làm đất', 'duration' => 3, 'status' => 'completed'],
            ['name' => 'Gieo/Trồng', 'duration' => 2, 'status' => 'completed'],
            ['name' => 'Nảy mầm', 'duration' => 5, 'status' => 'completed'],
            ['name' => 'Phát triển lá', 'duration' => 15, 'status' => 'in_progress'],
            ['name' => 'Thu hoạch', 'duration' => 5, 'status' => 'pending'],
        ];

        $currentDate = Carbon::parse($cropCycle->planned_start_date);
        $result = [];

        foreach ($stages as $index => $stage) {
            $startDate = $currentDate->copy();
            $endDate = $currentDate->addDays($stage['duration']);

            $result[] = static::new()->state([
                'crop_cycle_id' => $cropCycle->id,
                'stage_name' => $stage['name'],
                'sequence_order' => $index + 1,
                'planned_start_date' => $startDate,
                'planned_end_date' => $endDate,
                'status' => $stage['status'],
                'actual_start_date' => $stage['status'] !== 'pending' ? $startDate : null,
                'actual_end_date' => $stage['status'] === 'completed' ? $endDate : null,
            ]);
        }

        return $result;
    }
}

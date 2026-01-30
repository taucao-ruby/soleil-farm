<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\ActivityType;
use App\Models\CropCycle;
use App\Models\LandParcel;
use App\Models\UnitOfMeasure;
use App\Models\WaterSource;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for ActivityLog model.
 *
 * Tạo nhật ký hoạt động nông nghiệp với dữ liệu thực tế.
 * Bao gồm: tưới nước, bón phân, phun thuốc, thu hoạch, etc.
 *
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ActivityLog>
     */
    protected $model = ActivityLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $activityDate = fake()->dateTimeBetween('-3 months', 'now');
        $startHour = fake()->numberBetween(5, 16);
        $duration = fake()->numberBetween(1, 6);

        $performers = [
            'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Văn Cường',
            'Phạm Thị Dung', 'Hoàng Văn Em', 'Võ Thị Phương',
            'Đặng Văn Giang', 'Bùi Thị Hương', 'Ngô Văn Khang',
            'Đỗ Thị Linh', 'Vũ Văn Minh', 'Lý Thị Nga',
        ];

        $weatherConditions = [
            'Nắng đẹp', 'Nắng gắt', 'Nắng nhẹ',
            'Mây mù', 'Có mây',
            'Mưa nhỏ', 'Mưa vừa', 'Mưa rào',
            'Ẩm ướt', 'Khô ráo',
        ];

        $descriptions = [
            'Hoàn thành công việc đúng tiến độ',
            'Công việc diễn ra thuận lợi',
            'Đã hoàn thành theo kế hoạch',
            'Thực hiện đầy đủ quy trình',
            'Kết quả đạt yêu cầu',
            null,
        ];

        return [
            'activity_type_id' => ActivityType::inRandomOrder()->first()?->id ?? ActivityType::factory(),
            'crop_cycle_id' => CropCycle::factory(),
            'land_parcel_id' => null, // Usually derived from crop_cycle
            'water_source_id' => null, // Only for irrigation activities
            'activity_date' => $activityDate,
            'start_time' => sprintf('%02d:00:00', $startHour),
            'end_time' => sprintf('%02d:00:00', min($startHour + $duration, 20)),
            'description' => fake()->randomElement($descriptions),
            'quantity_value' => fake()->optional(0.7)->randomFloat(2, 1, 500),
            'quantity_unit_id' => UnitOfMeasure::inRandomOrder()->first()?->id,
            'cost_value' => fake()->optional(0.6)->randomFloat(0, 50000, 2000000),
            'cost_unit_id' => UnitOfMeasure::where('unit_type', 'currency')->first()?->id,
            'performed_by' => fake()->randomElement($performers),
            'weather_conditions' => fake()->optional(0.7)->randomElement($weatherConditions),
        ];
    }

    /**
     * Hoạt động tưới nước.
     */
    public function irrigation(): static
    {
        return $this->state(function (array $attributes) {
            $irrigationType = ActivityType::where('name', 'LIKE', '%Tưới%')->first();
            $volumeUnit = UnitOfMeasure::where('unit_type', 'volume')->first();

            return [
                'activity_type_id' => $irrigationType?->id ?? ActivityType::factory()->irrigation(),
                'water_source_id' => WaterSource::inRandomOrder()->first()?->id ?? WaterSource::factory(),
                'description' => fake()->randomElement([
                    'Tưới đẫm toàn bộ ruộng',
                    'Tưới bổ sung do thời tiết nóng',
                    'Tưới theo lịch định kỳ',
                    'Tưới khẩn cấp do hạn',
                    'Tưới nhỏ giọt tự động',
                ]),
                'quantity_value' => fake()->randomFloat(2, 50, 500),
                'quantity_unit_id' => $volumeUnit?->id,
                'cost_value' => fake()->randomFloat(0, 50000, 300000),
            ];
        });
    }

    /**
     * Hoạt động bón phân.
     */
    public function fertilizing(): static
    {
        return $this->state(function (array $attributes) {
            $fertilizingType = ActivityType::where('name', 'LIKE', '%Bón phân%')->first();
            $weightUnit = UnitOfMeasure::where('unit_type', 'weight')->first();

            $fertilizers = [
                'Bón phân NPK 16-16-8, liều lượng 200kg/ha',
                'Bón phân đạm urea, 100kg/ha',
                'Bón phân hữu cơ vi sinh',
                'Bón thúc phân kali, 50kg/ha',
                'Phun phân bón lá Đầu Trâu',
                'Bón phân lân, 150kg/ha',
            ];

            return [
                'activity_type_id' => $fertilizingType?->id ?? ActivityType::factory()->fertilizing(),
                'description' => fake()->randomElement($fertilizers),
                'quantity_value' => fake()->randomFloat(2, 10, 300),
                'quantity_unit_id' => $weightUnit?->id,
                'cost_value' => fake()->randomFloat(0, 200000, 1500000),
            ];
        });
    }

    /**
     * Hoạt động phun thuốc BVTV.
     */
    public function spraying(): static
    {
        return $this->state(function (array $attributes) {
            $sprayingType = ActivityType::where('name', 'LIKE', '%Phun%')->first();
            $volumeUnit = UnitOfMeasure::where('unit_type', 'volume')->first();

            $descriptions = [
                'Phun thuốc trừ sâu Regent 800WG',
                'Phun thuốc trừ bệnh Anvil 5SC',
                'Phun thuốc trừ cỏ Sofit 300EC',
                'Phun thuốc trừ rầy Bassa 50EC',
                'Phun thuốc kích thích sinh trưởng',
                'Phun thuốc phòng bệnh đạo ôn',
            ];

            return [
                'activity_type_id' => $sprayingType?->id ?? ActivityType::factory()->spraying(),
                'description' => fake()->randomElement($descriptions),
                'quantity_value' => fake()->randomFloat(2, 1, 50),
                'quantity_unit_id' => $volumeUnit?->id,
                'cost_value' => fake()->randomFloat(0, 100000, 800000),
            ];
        });
    }

    /**
     * Hoạt động gieo trồng.
     */
    public function planting(): static
    {
        return $this->state(function (array $attributes) {
            $plantingType = ActivityType::where('category', 'planting')->first();
            $weightUnit = UnitOfMeasure::where('unit_type', 'weight')->first();

            $descriptions = [
                'Gieo hạt lúa giống ST25, 120kg/ha',
                'Trồng cây con cà chua, 2000 cây/sào',
                'Cấy mạ lúa 18 ngày tuổi',
                'Gieo hạt ngô lai, 25kg/ha',
                'Trồng cây giống dưa hấu',
                'Gieo hạt rau cải, mật độ dày',
            ];

            return [
                'activity_type_id' => $plantingType?->id ?? ActivityType::factory()->planting(),
                'description' => fake()->randomElement($descriptions),
                'quantity_value' => fake()->randomFloat(2, 5, 200),
                'quantity_unit_id' => $weightUnit?->id,
                'cost_value' => fake()->randomFloat(0, 500000, 3000000),
            ];
        });
    }

    /**
     * Hoạt động thu hoạch.
     */
    public function harvesting(): static
    {
        return $this->state(function (array $attributes) {
            $harvestingType = ActivityType::where('category', 'harvesting')->first();
            $weightUnit = UnitOfMeasure::where('unit_type', 'weight')->first();

            $descriptions = [
                'Thu hoạch lúa bằng máy gặt đập liên hợp',
                'Thu hoạch rau bằng tay, đóng gói tại ruộng',
                'Gặt lúa thủ công, phơi tại chỗ',
                'Thu hoạch cà chua, phân loại theo size',
                'Thu hoạch dưa hấu, chuyển về kho',
                'Cắt rau muống lứa đầu tiên',
            ];

            return [
                'activity_type_id' => $harvestingType?->id ?? ActivityType::factory()->harvesting(),
                'description' => fake()->randomElement($descriptions),
                'quantity_value' => fake()->randomFloat(2, 100, 5000),
                'quantity_unit_id' => $weightUnit?->id,
                'cost_value' => fake()->randomFloat(0, 200000, 2000000),
            ];
        });
    }

    /**
     * Hoạt động làm cỏ.
     */
    public function weeding(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'description' => fake()->randomElement([
                    'Nhổ cỏ thủ công quanh gốc cây',
                    'Làm cỏ bằng máy xới mini',
                    'Phun thuốc diệt cỏ chọn lọc',
                    'Cào cỏ, dọn sạch luống',
                    'Xử lý cỏ dại trong mương',
                ]),
                'cost_value' => fake()->randomFloat(0, 50000, 500000),
            ];
        });
    }

    /**
     * Hoạt động kiểm tra đồng ruộng.
     */
    public function fieldInspection(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'description' => fake()->randomElement([
                    'Kiểm tra sâu bệnh định kỳ',
                    'Đánh giá tình trạng sinh trưởng',
                    'Kiểm tra hệ thống tưới',
                    'Khảo sát thiệt hại sau mưa bão',
                    'Đo độ ẩm đất và pH',
                ]),
                'quantity_value' => null,
                'cost_value' => null,
            ];
        });
    }

    /**
     * Hoạt động vào buổi sáng.
     */
    public function morning(): static
    {
        return $this->state(fn (array $attributes) => [
            'start_time' => sprintf('%02d:00:00', fake()->numberBetween(5, 8)),
            'end_time' => sprintf('%02d:00:00', fake()->numberBetween(9, 11)),
        ]);
    }

    /**
     * Hoạt động vào buổi chiều.
     */
    public function afternoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'start_time' => sprintf('%02d:00:00', fake()->numberBetween(13, 15)),
            'end_time' => sprintf('%02d:00:00', fake()->numberBetween(16, 18)),
        ]);
    }

    /**
     * Hoạt động với chi phí cao.
     */
    public function expensive(): static
    {
        return $this->state(fn (array $attributes) => [
            'cost_value' => fake()->randomFloat(0, 1000000, 5000000),
        ]);
    }

    /**
     * Hoạt động không tốn chi phí.
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'cost_value' => 0,
        ]);
    }

    /**
     * Gắn với lô đất cụ thể.
     */
    public function forLandParcel(LandParcel $landParcel): static
    {
        return $this->state(fn (array $attributes) => [
            'land_parcel_id' => $landParcel->id,
        ]);
    }

    /**
     * Gắn với vụ mùa cụ thể.
     */
    public function forCropCycle(CropCycle $cropCycle): static
    {
        return $this->state(fn (array $attributes) => [
            'crop_cycle_id' => $cropCycle->id,
            'land_parcel_id' => $cropCycle->land_parcel_id,
        ]);
    }
}

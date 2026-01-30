<?php

namespace Database\Factories;

use App\Models\CropCycle;
use App\Models\CropType;
use App\Models\LandParcel;
use App\Models\Season;
use App\Models\UnitOfMeasure;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for CropCycle model.
 *
 * Tạo vụ mùa canh tác với đầy đủ thông tin kế hoạch và thực tế.
 * Hỗ trợ các trạng thái: planned, active, completed, failed, abandoned.
 *
 * @extends Factory<CropCycle>
 */
class CropCycleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<CropCycle>
     */
    protected $model = CropCycle::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-6 months', '+1 month');
        $durationDays = fake()->numberBetween(60, 150);
        $endDate = Carbon::parse($startDate)->addDays($durationDays);

        $statuses = ['planned', 'active', 'completed', 'failed', 'abandoned'];
        $status = fake()->randomElement($statuses);

        $actualStartDate = null;
        $actualEndDate = null;
        $yieldValue = null;
        $qualityRating = null;
        $notes = null;

        // Thiết lập dữ liệu dựa trên trạng thái
        if ($status === 'active') {
            $actualStartDate = $startDate;
        } elseif ($status === 'completed') {
            $actualStartDate = $startDate;
            $actualEndDate = $endDate;
            $yieldValue = fake()->randomFloat(2, 500, 10000);
            $qualityRating = fake()->randomElement(['excellent', 'good', 'average', 'poor']);
            $notes = fake()->optional(0.6)->randomElement([
                'Vụ mùa thành công, năng suất đạt kỳ vọng',
                'Năng suất cao hơn dự kiến nhờ thời tiết thuận lợi',
                'Chất lượng sản phẩm tốt, giá bán cao',
                'Đạt sản lượng mục tiêu, cần cải thiện quy trình',
            ]);
        } elseif ($status === 'failed') {
            $actualStartDate = $startDate;
            $actualEndDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(20, 60));
            $yieldValue = fake()->randomFloat(2, 0, 200);
            $qualityRating = 'poor';
            $notes = fake()->randomElement([
                'Vụ mùa thất bại do hạn hán kéo dài',
                'Thiệt hại nặng do lũ lụt bất ngờ',
                'Sâu bệnh phá hoại, không thể cứu vãn',
                'Thời tiết cực đoan gây mất mùa',
                'Thiếu nước tưới nghiêm trọng',
            ]);
        } elseif ($status === 'abandoned') {
            $actualStartDate = $startDate;
            $notes = fake()->randomElement([
                'Hủy vụ do thay đổi kế hoạch canh tác',
                'Chuyển đổi mục đích sử dụng đất',
                'Thiếu nhân lực và vật tư',
                'Điều kiện thời tiết không phù hợp',
            ]);
        }

        return [
            'cycle_code' => 'VM-' . fake()->unique()->numerify('####'),
            'land_parcel_id' => LandParcel::factory(),
            'crop_type_id' => CropType::inRandomOrder()->first()?->id ?? CropType::factory(),
            'season_id' => Season::inRandomOrder()->first()?->id ?? Season::factory(),
            'status' => $status,
            'planned_start_date' => $startDate,
            'planned_end_date' => $endDate,
            'actual_start_date' => $actualStartDate,
            'actual_end_date' => $actualEndDate,
            'yield_value' => $yieldValue,
            'yield_unit_id' => UnitOfMeasure::where('unit_type', 'weight')->inRandomOrder()->first()?->id,
            'quality_rating' => $qualityRating,
            'notes' => $notes,
        ];
    }

    /**
     * Vụ mùa đang lên kế hoạch.
     */
    public function planned(): static
    {
        $startDate = fake()->dateTimeBetween('+1 week', '+3 months');
        $durationDays = fake()->numberBetween(60, 120);
        $endDate = Carbon::parse($startDate)->addDays($durationDays);

        return $this->state(fn (array $attributes) => [
            'status' => 'planned',
            'planned_start_date' => $startDate,
            'planned_end_date' => $endDate,
            'actual_start_date' => null,
            'actual_end_date' => null,
            'yield_value' => null,
            'quality_rating' => null,
            'notes' => fake()->optional(0.5)->randomElement([
                'Chuẩn bị giống và vật tư',
                'Đang chờ thời tiết thuận lợi',
                'Kế hoạch canh tác đã được phê duyệt',
            ]),
        ]);
    }

    /**
     * Vụ mùa đang hoạt động.
     */
    public function active(): static
    {
        $startDate = fake()->dateTimeBetween('-2 months', '-1 week');
        $durationDays = fake()->numberBetween(60, 120);
        $endDate = Carbon::parse($startDate)->addDays($durationDays);

        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'planned_start_date' => $startDate,
            'planned_end_date' => $endDate,
            'actual_start_date' => $startDate,
            'actual_end_date' => null,
            'yield_value' => null,
            'quality_rating' => null,
            'notes' => fake()->optional(0.5)->randomElement([
                'Cây đang phát triển tốt',
                'Đang trong giai đoạn chăm sóc',
                'Thời tiết thuận lợi cho vụ mùa',
                'Cần theo dõi sâu bệnh thường xuyên',
            ]),
        ]);
    }

    /**
     * Vụ mùa đã hoàn thành thành công.
     */
    public function completed(): static
    {
        $startDate = fake()->dateTimeBetween('-6 months', '-3 months');
        $durationDays = fake()->numberBetween(60, 120);
        $endDate = Carbon::parse($startDate)->addDays($durationDays);

        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'planned_start_date' => $startDate,
            'planned_end_date' => $endDate,
            'actual_start_date' => $startDate,
            'actual_end_date' => $endDate,
            'yield_value' => fake()->randomFloat(2, 1000, 8000),
            'quality_rating' => fake()->randomElement(['excellent', 'good', 'average']),
            'notes' => fake()->optional(0.7)->randomElement([
                'Vụ mùa thành công, năng suất đạt kỳ vọng',
                'Sản lượng cao hơn dự kiến 15%',
                'Chất lượng sản phẩm đạt tiêu chuẩn xuất khẩu',
                'Hoàn thành đúng tiến độ, chi phí trong ngân sách',
            ]),
        ]);
    }

    /**
     * Vụ mùa thất bại.
     */
    public function failed(): static
    {
        $startDate = fake()->dateTimeBetween('-6 months', '-2 months');
        $failDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(20, 60));

        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'planned_start_date' => $startDate,
            'planned_end_date' => Carbon::parse($startDate)->addDays(90),
            'actual_start_date' => $startDate,
            'actual_end_date' => $failDate,
            'yield_value' => fake()->randomFloat(2, 0, 200),
            'quality_rating' => 'poor',
            'notes' => fake()->randomElement([
                'Vụ mùa thất bại do hạn hán kéo dài, thiệt hại 90%',
                'Lũ lụt bất ngờ gây ngập úng, mất trắng',
                'Dịch sâu cuốn lá bùng phát, không kiểm soát được',
                'Bệnh đạo ôn lan rộng, thiệt hại nặng',
                'Rét đậm rét hại kéo dài, cây chết hàng loạt',
            ]),
        ]);
    }

    /**
     * Vụ mùa bị hủy bỏ.
     */
    public function abandoned(): static
    {
        $startDate = fake()->dateTimeBetween('-4 months', '-1 month');

        return $this->state(fn (array $attributes) => [
            'status' => 'abandoned',
            'planned_start_date' => $startDate,
            'planned_end_date' => Carbon::parse($startDate)->addDays(90),
            'actual_start_date' => $startDate,
            'actual_end_date' => null,
            'yield_value' => null,
            'quality_rating' => null,
            'notes' => fake()->randomElement([
                'Hủy vụ do thay đổi kế hoạch kinh doanh',
                'Chuyển đổi sang trồng cây khác có giá trị hơn',
                'Thiếu lao động trong mùa cao điểm',
                'Giá vật tư tăng cao, không đảm bảo lợi nhuận',
            ]),
        ]);
    }

    /**
     * Vụ mùa với năng suất cao.
     */
    public function highYield(): static
    {
        return $this->completed()->state(fn (array $attributes) => [
            'yield_value' => fake()->randomFloat(2, 6000, 12000),
            'quality_rating' => 'excellent',
            'notes' => 'Năng suất vượt kỳ vọng, chất lượng xuất sắc',
        ]);
    }

    /**
     * Vụ mùa với năng suất thấp.
     */
    public function lowYield(): static
    {
        return $this->completed()->state(fn (array $attributes) => [
            'yield_value' => fake()->randomFloat(2, 200, 800),
            'quality_rating' => 'poor',
            'notes' => 'Năng suất thấp do điều kiện bất lợi',
        ]);
    }

    /**
     * Vụ lúa.
     */
    public function riceCrop(): static
    {
        return $this->state(function (array $attributes) {
            $riceType = CropType::where('name', 'LIKE', '%Lúa%')->first();

            return [
                'crop_type_id' => $riceType?->id ?? CropType::factory()->rice(),
            ];
        });
    }

    /**
     * Vụ rau.
     */
    public function vegetableCrop(): static
    {
        return $this->state(function (array $attributes) {
            $vegType = CropType::where('category', 'vegetables')->inRandomOrder()->first();

            return [
                'crop_type_id' => $vegType?->id ?? CropType::factory()->vegetable(),
            ];
        });
    }
}

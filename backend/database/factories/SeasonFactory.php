<?php

namespace Database\Factories;

use App\Models\Season;
use App\Models\SeasonDefinition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for Season model.
 *
 * Tạo mùa vụ cụ thể theo năm dựa trên SeasonDefinition.
 * Mỗi năm có thể có nhiều vụ mùa khác nhau.
 *
 * @extends Factory<Season>
 */
class SeasonFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Season>
     */
    protected $model = Season::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(2024, 2026);

        // Tính toán ngày bắt đầu và kết thúc dựa trên năm
        $startMonth = fake()->numberBetween(1, 6);
        $endMonth = $startMonth + fake()->numberBetween(3, 5);

        if ($endMonth > 12) {
            $endMonth = 12;
        }

        $startDate = fake()->dateTimeBetween("{$year}-{$startMonth}-01", "{$year}-{$startMonth}-28");
        $endDate = fake()->dateTimeBetween("{$year}-{$endMonth}-01", "{$year}-{$endMonth}-28");

        return [
            'season_definition_id' => SeasonDefinition::factory(),
            'year' => $year,
            'actual_start_date' => $startDate,
            'actual_end_date' => $endDate,
            'notes' => fake()->optional(0.4)->randomElement([
                'Thời tiết thuận lợi, mưa đều',
                'Hạn hán kéo dài, cần tưới bổ sung',
                'Mưa nhiều hơn trung bình, cần thoát nước tốt',
                'Sâu bệnh phát triển mạnh, cần phun thuốc phòng ngừa',
                'Năng suất dự kiến cao hơn năm trước',
            ]),
        ];
    }

    /**
     * Mùa vụ năm hiện tại.
     */
    public function currentYear(): static
    {
        $year = now()->year;

        return $this->state(fn (array $attributes) => [
            'year' => $year,
            'actual_start_date' => now()->startOfYear()->addMonths(fake()->numberBetween(0, 2)),
            'actual_end_date' => now()->startOfYear()->addMonths(fake()->numberBetween(4, 6)),
        ]);
    }

    /**
     * Mùa vụ năm trước.
     */
    public function previousYear(): static
    {
        $year = now()->year - 1;

        return $this->state(fn (array $attributes) => [
            'year' => $year,
            'actual_start_date' => "{$year}-02-01",
            'actual_end_date' => "{$year}-06-30",
        ]);
    }

    /**
     * Vụ Đông Xuân (tháng 11 năm trước - tháng 4 năm sau).
     */
    public function dongXuan(int $year = null): static
    {
        $year = $year ?? now()->year;

        return $this->state(fn (array $attributes) => [
            'year' => $year,
            'actual_start_date' => ($year - 1) . '-11-15',
            'actual_end_date' => $year . '-04-15',
            'notes' => 'Vụ Đông Xuân - vụ chính, năng suất cao nhất trong năm',
        ]);
    }

    /**
     * Vụ Hè Thu (tháng 5 - tháng 8).
     */
    public function heThu(int $year = null): static
    {
        $year = $year ?? now()->year;

        return $this->state(fn (array $attributes) => [
            'year' => $year,
            'actual_start_date' => $year . '-05-01',
            'actual_end_date' => $year . '-08-31',
            'notes' => 'Vụ Hè Thu - thời tiết nóng, mưa nhiều',
        ]);
    }

    /**
     * Vụ Thu Đông (tháng 9 - tháng 11).
     */
    public function thuDong(int $year = null): static
    {
        $year = $year ?? now()->year;

        return $this->state(fn (array $attributes) => [
            'year' => $year,
            'actual_start_date' => $year . '-09-01',
            'actual_end_date' => $year . '-11-30',
            'notes' => 'Vụ Thu Đông - thời tiết mát dần, ít mưa',
        ]);
    }

    /**
     * Với ghi chú cụ thể.
     */
    public function withNotes(string $notes): static
    {
        return $this->state(fn (array $attributes) => [
            'notes' => $notes,
        ]);
    }
}

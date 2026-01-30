<?php

namespace Database\Factories;

use App\Models\SeasonDefinition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for SeasonDefinition model.
 *
 * Định nghĩa các mùa vụ canh tác tại Việt Nam.
 * Các mùa chính: Xuân, Hè Thu, Đông Xuân, Mùa mưa.
 *
 * @extends Factory<SeasonDefinition>
 */
class SeasonDefinitionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<SeasonDefinition>
     */
    protected $model = SeasonDefinition::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $seasons = [
            [
                'name' => 'Vụ Đông Xuân',
                'code' => 'DONG_XUAN',
                'description' => 'Vụ mùa chính từ tháng 11 đến tháng 4 năm sau, thời tiết mát mẻ, ít mưa',
                'typical_start_month' => 11,
                'typical_end_month' => 4,
            ],
            [
                'name' => 'Vụ Hè Thu',
                'code' => 'HE_THU',
                'description' => 'Vụ mùa từ tháng 5 đến tháng 8, thời tiết nóng, mưa nhiều',
                'typical_start_month' => 5,
                'typical_end_month' => 8,
            ],
            [
                'name' => 'Vụ Thu Đông',
                'code' => 'THU_DONG',
                'description' => 'Vụ mùa từ tháng 9 đến tháng 11, thời tiết mát dần',
                'typical_start_month' => 9,
                'typical_end_month' => 11,
            ],
            [
                'name' => 'Vụ Xuân Hè',
                'code' => 'XUAN_HE',
                'description' => 'Vụ mùa từ tháng 2 đến tháng 5, thời tiết ấm dần',
                'typical_start_month' => 2,
                'typical_end_month' => 5,
            ],
            [
                'name' => 'Vụ Mùa',
                'code' => 'MUA',
                'description' => 'Vụ mùa chính tại miền Bắc, từ tháng 6 đến tháng 10',
                'typical_start_month' => 6,
                'typical_end_month' => 10,
            ],
        ];

        $season = fake()->randomElement($seasons);

        return [
            'name' => $season['name'],
            'code' => $season['code'] . '_' . fake()->unique()->numerify('###'),
            'description' => $season['description'],
            'typical_start_month' => $season['typical_start_month'],
            'typical_end_month' => $season['typical_end_month'],
            'is_active' => true,
        ];
    }

    /**
     * Vụ Đông Xuân - vụ chính.
     */
    public function dongXuan(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Vụ Đông Xuân',
            'code' => 'DONG_XUAN',
            'description' => 'Vụ mùa chính từ tháng 11 đến tháng 4 năm sau, thời tiết mát mẻ, ít mưa',
            'typical_start_month' => 11,
            'typical_end_month' => 4,
        ]);
    }

    /**
     * Vụ Hè Thu.
     */
    public function heThu(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Vụ Hè Thu',
            'code' => 'HE_THU',
            'description' => 'Vụ mùa từ tháng 5 đến tháng 8, thời tiết nóng, mưa nhiều',
            'typical_start_month' => 5,
            'typical_end_month' => 8,
        ]);
    }

    /**
     * Vụ Thu Đông.
     */
    public function thuDong(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Vụ Thu Đông',
            'code' => 'THU_DONG',
            'description' => 'Vụ mùa từ tháng 9 đến tháng 11, thời tiết mát dần',
            'typical_start_month' => 9,
            'typical_end_month' => 11,
        ]);
    }

    /**
     * Mùa vụ không hoạt động.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\WaterSource;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for WaterSource model.
 *
 * Tạo nguồn nước tưới cho nông nghiệp Việt Nam.
 * Bao gồm: giếng khoan, ao hồ, kênh mương, sông suối.
 *
 * @extends Factory<WaterSource>
 */
class WaterSourceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<WaterSource>
     */
    protected $model = WaterSource::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $waterSources = [
            // Giếng khoan
            [
                'name' => 'Giếng khoan số ' . fake()->numberBetween(1, 10),
                'source_type' => 'well',
                'description' => 'Giếng khoan sâu ' . fake()->numberBetween(20, 100) . 'm, nước ngầm',
                'reliability' => 'permanent',
                'water_quality' => 'good',
            ],
            [
                'name' => 'Giếng đào',
                'source_type' => 'well',
                'description' => 'Giếng đào truyền thống, nước ngầm tầng nông',
                'reliability' => 'seasonal',
                'water_quality' => 'moderate',
            ],
            // Ao hồ
            [
                'name' => 'Ao tưới ' . fake()->randomElement(['lớn', 'nhỏ', 'trung tâm']),
                'source_type' => 'pond',
                'description' => 'Ao chứa nước tưới, dung tích ' . fake()->numberBetween(500, 5000) . 'm³',
                'reliability' => 'permanent',
                'water_quality' => 'good',
            ],
            [
                'name' => 'Hồ chứa ' . fake()->randomElement(['Đông', 'Tây', 'Nam', 'Bắc']),
                'source_type' => 'reservoir',
                'description' => 'Hồ chứa nước mưa và nước suối',
                'reliability' => 'seasonal',
                'water_quality' => 'good',
            ],
            // Kênh mương
            [
                'name' => 'Kênh tưới chính',
                'source_type' => 'canal',
                'description' => 'Kênh tưới từ hệ thống thủy lợi',
                'reliability' => 'permanent',
                'water_quality' => 'good',
            ],
            [
                'name' => 'Mương nội đồng',
                'source_type' => 'canal',
                'description' => 'Mương dẫn nước trong ruộng',
                'reliability' => 'seasonal',
                'water_quality' => 'moderate',
            ],
            // Sông suối
            [
                'name' => 'Máy bơm sông ' . fake()->randomElement(['Hồng', 'Cửu Long', 'Đồng Nai', 'Sài Gòn']),
                'source_type' => 'river',
                'description' => 'Trạm bơm nước từ sông',
                'reliability' => 'permanent',
                'water_quality' => 'moderate',
            ],
            [
                'name' => 'Suối ' . fake()->randomElement(['Trong', 'Lớn', 'Nhỏ', 'Đá']),
                'source_type' => 'stream',
                'description' => 'Suối tự nhiên',
                'reliability' => 'seasonal',
                'water_quality' => 'good',
            ],
            // Hệ thống tưới hiện đại
            [
                'name' => 'Hệ thống tưới nhỏ giọt',
                'source_type' => 'drip_irrigation',
                'description' => 'Hệ thống tưới nhỏ giọt tự động',
                'reliability' => 'permanent',
                'water_quality' => 'good',
            ],
            [
                'name' => 'Hệ thống tưới phun mưa',
                'source_type' => 'sprinkler',
                'description' => 'Hệ thống tưới phun mưa',
                'reliability' => 'permanent',
                'water_quality' => 'good',
            ],
        ];

        $source = fake()->randomElement($waterSources);

        // Tọa độ mẫu tại Việt Nam (đồng bằng sông Cửu Long)
        $latitude = fake()->randomFloat(8, 9.5, 11.5);
        $longitude = fake()->randomFloat(8, 105.0, 107.0);

        return [
            'name' => $source['name'],
            'code' => 'NN-' . fake()->unique()->numerify('####'),
            'source_type' => $source['source_type'],
            'description' => $source['description'],
            'latitude' => $latitude,
            'longitude' => $longitude,
            'reliability' => $source['reliability'],
            'water_quality' => $source['water_quality'],
            'is_active' => true,
        ];
    }

    /**
     * Nguồn nước từ giếng khoan.
     */
    public function well(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Giếng khoan số ' . fake()->numberBetween(1, 10),
            'source_type' => 'well',
            'description' => 'Giếng khoan sâu ' . fake()->numberBetween(20, 100) . 'm',
            'reliability' => 'permanent',
            'water_quality' => 'good',
        ]);
    }

    /**
     * Nguồn nước từ ao hồ.
     */
    public function pond(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Ao tưới ' . fake()->randomElement(['lớn', 'nhỏ', 'trung tâm']),
            'source_type' => 'pond',
            'description' => 'Ao chứa nước tưới',
            'reliability' => 'permanent',
            'water_quality' => 'good',
        ]);
    }

    /**
     * Nguồn nước từ kênh mương.
     */
    public function canal(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Kênh tưới chính',
            'source_type' => 'canal',
            'description' => 'Kênh tưới từ hệ thống thủy lợi',
            'reliability' => 'permanent',
            'water_quality' => 'good',
        ]);
    }

    /**
     * Nguồn nước từ sông.
     */
    public function river(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Máy bơm sông',
            'source_type' => 'river',
            'description' => 'Trạm bơm nước từ sông',
            'reliability' => 'permanent',
            'water_quality' => 'moderate',
        ]);
    }

    /**
     * Hệ thống tưới nhỏ giọt.
     */
    public function dripIrrigation(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Hệ thống tưới nhỏ giọt',
            'source_type' => 'drip_irrigation',
            'description' => 'Hệ thống tưới nhỏ giọt tự động Israel',
            'reliability' => 'permanent',
            'water_quality' => 'good',
        ]);
    }

    /**
     * Nguồn nước theo mùa.
     */
    public function seasonal(): static
    {
        return $this->state(fn (array $attributes) => [
            'reliability' => 'seasonal',
        ]);
    }

    /**
     * Nguồn nước ổn định.
     */
    public function permanent(): static
    {
        return $this->state(fn (array $attributes) => [
            'reliability' => 'permanent',
        ]);
    }

    /**
     * Chất lượng nước tốt.
     */
    public function goodQuality(): static
    {
        return $this->state(fn (array $attributes) => [
            'water_quality' => 'good',
        ]);
    }

    /**
     * Nguồn nước không hoạt động.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

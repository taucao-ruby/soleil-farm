<?php

namespace Database\Factories;

use App\Models\UnitOfMeasure;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for UnitOfMeasure model.
 *
 * Tạo đơn vị đo lường cho hệ thống nông nghiệp Việt Nam.
 * Hỗ trợ các loại đơn vị: diện tích, khối lượng, thể tích, tiền tệ.
 *
 * @extends Factory<UnitOfMeasure>
 */
class UnitOfMeasureFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<UnitOfMeasure>
     */
    protected $model = UnitOfMeasure::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $units = [
            // Diện tích
            ['name' => 'm²', 'abbreviation' => 'm²', 'unit_type' => 'area', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'hecta', 'abbreviation' => 'ha', 'unit_type' => 'area', 'conversion_factor_to_base' => 10000, 'is_base_unit' => false],
            ['name' => 'sào', 'abbreviation' => 'sào', 'unit_type' => 'area', 'conversion_factor_to_base' => 360, 'is_base_unit' => false],
            ['name' => 'mẫu', 'abbreviation' => 'mẫu', 'unit_type' => 'area', 'conversion_factor_to_base' => 3600, 'is_base_unit' => false],
            // Khối lượng
            ['name' => 'kg', 'abbreviation' => 'kg', 'unit_type' => 'weight', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'tạ', 'abbreviation' => 'tạ', 'unit_type' => 'weight', 'conversion_factor_to_base' => 100, 'is_base_unit' => false],
            ['name' => 'tấn', 'abbreviation' => 'tấn', 'unit_type' => 'weight', 'conversion_factor_to_base' => 1000, 'is_base_unit' => false],
            ['name' => 'gram', 'abbreviation' => 'g', 'unit_type' => 'weight', 'conversion_factor_to_base' => 0.001, 'is_base_unit' => false],
            // Thể tích
            ['name' => 'lít', 'abbreviation' => 'L', 'unit_type' => 'volume', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
            ['name' => 'm³', 'abbreviation' => 'm³', 'unit_type' => 'volume', 'conversion_factor_to_base' => 1000, 'is_base_unit' => false],
            // Tiền tệ
            ['name' => 'VND', 'abbreviation' => 'đ', 'unit_type' => 'currency', 'conversion_factor_to_base' => 1, 'is_base_unit' => true],
        ];

        $unit = fake()->randomElement($units);

        return [
            'name' => $unit['name'],
            'abbreviation' => $unit['abbreviation'],
            'unit_type' => $unit['unit_type'],
            'conversion_factor_to_base' => $unit['conversion_factor_to_base'],
            'is_base_unit' => $unit['is_base_unit'],
            'is_active' => true,
        ];
    }

    /**
     * Đơn vị diện tích.
     */
    public function area(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'm²',
            'abbreviation' => 'm²',
            'unit_type' => 'area',
            'conversion_factor_to_base' => 1,
            'is_base_unit' => true,
        ]);
    }

    /**
     * Đơn vị hecta.
     */
    public function hectare(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'hecta',
            'abbreviation' => 'ha',
            'unit_type' => 'area',
            'conversion_factor_to_base' => 10000,
            'is_base_unit' => false,
        ]);
    }

    /**
     * Đơn vị khối lượng (kg).
     */
    public function weight(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'kg',
            'abbreviation' => 'kg',
            'unit_type' => 'weight',
            'conversion_factor_to_base' => 1,
            'is_base_unit' => true,
        ]);
    }

    /**
     * Đơn vị thể tích (lít).
     */
    public function volume(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'lít',
            'abbreviation' => 'L',
            'unit_type' => 'volume',
            'conversion_factor_to_base' => 1,
            'is_base_unit' => true,
        ]);
    }

    /**
     * Đơn vị tiền tệ (VND).
     */
    public function currency(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'VND',
            'abbreviation' => 'đ',
            'unit_type' => 'currency',
            'conversion_factor_to_base' => 1,
            'is_base_unit' => true,
        ]);
    }

    /**
     * Đơn vị không hoạt động.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

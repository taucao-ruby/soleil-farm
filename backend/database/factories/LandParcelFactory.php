<?php

namespace Database\Factories;

use App\Models\LandParcel;
use App\Models\UnitOfMeasure;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for LandParcel model.
 *
 * Tạo lô đất nông nghiệp Việt Nam với đặc điểm thổ nhưỡng đa dạng.
 * Hỗ trợ các loại đất: ruộng, vườn, ao, đất trống.
 *
 * @extends Factory<LandParcel>
 */
class LandParcelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<LandParcel>
     */
    protected $model = LandParcel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $landNames = [
            // Ruộng lúa
            'Ruộng Đông', 'Ruộng Tây', 'Ruộng Nam', 'Ruộng Bắc',
            'Ruộng Lớn', 'Ruộng Nhỏ', 'Ruộng Giữa', 'Ruộng Sâu',
            // Lô đất
            'Lô đất A1', 'Lô đất A2', 'Lô đất B1', 'Lô đất B2',
            'Lô đất C1', 'Lô đất C2', 'Lô đất D1', 'Lô đất D2',
            // Vườn
            'Vườn trước nhà', 'Vườn sau nhà', 'Vườn ven đường',
            'Vườn cây ăn trái', 'Vườn rau sạch', 'Vườn ươm',
            // Khác
            'Đất ven sông', 'Đất gò cao', 'Đất trũng', 'Bãi bồi',
        ];

        $soilTypes = [
            'đất phù sa' => 'Đất phù sa màu mỡ, thích hợp trồng lúa và rau màu',
            'đất cát' => 'Đất cát, thoát nước tốt, thích hợp trồng dưa và đậu',
            'đất sét' => 'Đất sét, giữ nước tốt, thích hợp trồng lúa nước',
            'đất pha' => 'Đất pha cát sét, đa dụng cho nhiều loại cây',
            'đất xám' => 'Đất xám bạc màu, cần bón phân cải tạo',
            'đất đỏ bazan' => 'Đất đỏ bazan, thích hợp cây công nghiệp',
            'đất mùn' => 'Đất mùn giàu dinh dưỡng, thích hợp rau xanh',
            'đất thịt' => 'Đất thịt nhẹ, thích hợp nhiều loại cây trồng',
        ];

        $terrainTypes = [
            'flat' => 'Bằng phẳng',
            'sloped' => 'Dốc nhẹ',
            'terraced' => 'Ruộng bậc thang',
            'lowland' => 'Vùng trũng',
            'highland' => 'Vùng cao',
        ];

        $landTypes = [
            'rice_field' => 'Ruộng lúa',
            'vegetable_garden' => 'Vườn rau',
            'orchard' => 'Vườn cây ăn trái',
            'mixed_crop' => 'Đất trồng xen canh',
            'nursery' => 'Vườn ươm',
            'fallow' => 'Đất nghỉ',
        ];

        $soilType = fake()->randomElement(array_keys($soilTypes));
        $terrainType = fake()->randomElement(array_keys($terrainTypes));
        $landType = fake()->randomElement(array_keys($landTypes));

        // Tọa độ mẫu tại Việt Nam (đồng bằng sông Cửu Long và miền Nam)
        $latitude = fake()->randomFloat(8, 9.5, 12.5);
        $longitude = fake()->randomFloat(8, 105.0, 108.0);

        return [
            'name' => fake()->randomElement($landNames),
            'code' => 'LD-' . fake()->unique()->numerify('####'),
            'description' => $soilTypes[$soilType] . '. ' . fake()->optional(0.5)->sentence(),
            'land_type' => $landType,
            'area_value' => fake()->randomFloat(2, 100, 10000),
            'area_unit_id' => UnitOfMeasure::where('unit_type', 'area')->inRandomOrder()->first()?->id,
            'terrain_type' => $terrainType,
            'soil_type' => $soilType,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'is_active' => true,
        ];
    }

    /**
     * Lô đất đang sử dụng.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Lô đất không hoạt động/nghỉ.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Ruộng lúa.
     */
    public function riceField(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Ruộng Đông', 'Ruộng Tây', 'Ruộng Lớn', 'Ruộng Nhỏ']),
            'land_type' => 'rice_field',
            'terrain_type' => 'flat',
            'soil_type' => fake()->randomElement(['đất phù sa', 'đất sét', 'đất thịt']),
            'description' => 'Ruộng lúa nước, có hệ thống thủy lợi',
            'area_value' => fake()->randomFloat(2, 1000, 10000),
        ]);
    }

    /**
     * Vườn rau.
     */
    public function vegetableGarden(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Vườn rau sạch', 'Vườn sau nhà', 'Vườn ven đường']),
            'land_type' => 'vegetable_garden',
            'terrain_type' => 'flat',
            'soil_type' => fake()->randomElement(['đất mùn', 'đất pha', 'đất phù sa']),
            'description' => 'Vườn trồng rau sạch, đất màu mỡ',
            'area_value' => fake()->randomFloat(2, 100, 2000),
        ]);
    }

    /**
     * Vườn cây ăn trái.
     */
    public function orchard(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->randomElement(['Vườn cây ăn trái', 'Vườn trước nhà', 'Vườn ven sông']),
            'land_type' => 'orchard',
            'terrain_type' => fake()->randomElement(['flat', 'sloped']),
            'soil_type' => fake()->randomElement(['đất đỏ bazan', 'đất phù sa', 'đất pha']),
            'description' => 'Vườn cây ăn trái lâu năm',
            'area_value' => fake()->randomFloat(2, 500, 5000),
        ]);
    }

    /**
     * Đất lớn (> 5000m²).
     */
    public function large(): static
    {
        return $this->state(fn (array $attributes) => [
            'area_value' => fake()->randomFloat(2, 5000, 20000),
        ]);
    }

    /**
     * Đất nhỏ (< 500m²).
     */
    public function small(): static
    {
        return $this->state(fn (array $attributes) => [
            'area_value' => fake()->randomFloat(2, 50, 500),
        ]);
    }

    /**
     * Đất phù sa (màu mỡ).
     */
    public function alluvialSoil(): static
    {
        return $this->state(fn (array $attributes) => [
            'soil_type' => 'đất phù sa',
            'description' => 'Đất phù sa màu mỡ, năng suất cao, thích hợp trồng lúa và rau màu',
        ]);
    }

    /**
     * Đất cát.
     */
    public function sandySoil(): static
    {
        return $this->state(fn (array $attributes) => [
            'soil_type' => 'đất cát',
            'description' => 'Đất cát thoát nước tốt, thích hợp trồng dưa hấu và đậu phộng',
        ]);
    }

    /**
     * Đất vùng Đồng bằng sông Cửu Long.
     */
    public function mekongDelta(): static
    {
        return $this->state(fn (array $attributes) => [
            'latitude' => fake()->randomFloat(8, 9.0, 10.5),
            'longitude' => fake()->randomFloat(8, 105.0, 106.5),
            'soil_type' => 'đất phù sa',
            'description' => 'Đất phù sa màu mỡ vùng Đồng bằng sông Cửu Long',
        ]);
    }

    /**
     * Đất vùng Tây Nguyên.
     */
    public function centralHighlands(): static
    {
        return $this->state(fn (array $attributes) => [
            'latitude' => fake()->randomFloat(8, 11.5, 14.5),
            'longitude' => fake()->randomFloat(8, 107.5, 108.5),
            'soil_type' => 'đất đỏ bazan',
            'terrain_type' => 'highland',
            'description' => 'Đất đỏ bazan Tây Nguyên, thích hợp cây công nghiệp',
        ]);
    }
}

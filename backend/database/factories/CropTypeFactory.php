<?php

namespace Database\Factories;

use App\Models\CropType;
use App\Models\UnitOfMeasure;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for CropType model.
 *
 * Tạo các loại cây trồng phổ biến tại Việt Nam.
 * Bao gồm: lúa, ngô, rau, trái cây và cây công nghiệp.
 *
 * @extends Factory<CropType>
 */
class CropTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<CropType>
     */
    protected $model = CropType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Valid enum categories from migration: grain, vegetable, fruit, legume, tuber, herb, flower, fodder, other
        $crops = [
            // Lương thực (grain)
            [
                'name' => 'Lúa',
                'code' => 'LUA',
                'scientific_name' => 'Oryza sativa',
                'variety' => fake()->randomElement(['IR50404', 'OM5451', 'Jasmine 85', 'ST24', 'ST25']),
                'category' => 'grain',
                'description' => 'Cây lúa nước - cây lương thực chính của Việt Nam',
                'typical_grow_duration_days' => fake()->numberBetween(90, 120),
            ],
            [
                'name' => 'Ngô',
                'code' => 'NGO',
                'scientific_name' => 'Zea mays',
                'variety' => fake()->randomElement(['LVN10', 'LVN4', 'NK66', 'CP888']),
                'category' => 'grain',
                'description' => 'Cây ngô - lương thực và thức ăn chăn nuôi',
                'typical_grow_duration_days' => fake()->numberBetween(80, 100),
            ],
            // Rau củ (vegetable)
            [
                'name' => 'Cà chua',
                'code' => 'CA_CHUA',
                'scientific_name' => 'Solanum lycopersicum',
                'variety' => fake()->randomElement(['Anna', 'Savior', 'TN52', 'Kim Cương']),
                'category' => 'vegetable',
                'description' => 'Cà chua - rau ăn quả phổ biến',
                'typical_grow_duration_days' => fake()->numberBetween(90, 110),
            ],
            [
                'name' => 'Rau cải',
                'code' => 'RAU_CAI',
                'scientific_name' => 'Brassica rapa',
                'variety' => fake()->randomElement(['Cải ngọt', 'Cải xanh', 'Cải thìa', 'Cải bẹ xanh']),
                'category' => 'vegetable',
                'description' => 'Rau cải - rau ăn lá ngắn ngày',
                'typical_grow_duration_days' => fake()->numberBetween(25, 35),
            ],
            [
                'name' => 'Rau muống',
                'code' => 'RAU_MUONG',
                'scientific_name' => 'Ipomoea aquatica',
                'variety' => fake()->randomElement(['Rau muống nước', 'Rau muống cạn']),
                'category' => 'vegetable',
                'description' => 'Rau muống - rau ăn lá phổ biến nhất Việt Nam',
                'typical_grow_duration_days' => fake()->numberBetween(20, 30),
            ],
            [
                'name' => 'Dưa leo',
                'code' => 'DUA_LEO',
                'scientific_name' => 'Cucumis sativus',
                'variety' => fake()->randomElement(['Dưa leo Baby', 'Dưa leo Nhật', 'Dưa leo trắng']),
                'category' => 'vegetable',
                'description' => 'Dưa leo - rau ăn quả giàu nước',
                'typical_grow_duration_days' => fake()->numberBetween(45, 60),
            ],
            // Trái cây (fruit)
            [
                'name' => 'Dưa hấu',
                'code' => 'DUA_HAU',
                'scientific_name' => 'Citrullus lanatus',
                'variety' => fake()->randomElement(['Dưa hấu không hạt', 'Dưa hấu Hắc Mỹ Nhân', 'Dưa hấu Phù Đổng']),
                'category' => 'fruit',
                'description' => 'Dưa hấu - trái cây mùa hè phổ biến',
                'typical_grow_duration_days' => fake()->numberBetween(75, 90),
            ],
            [
                'name' => 'Thanh long',
                'code' => 'THANH_LONG',
                'scientific_name' => 'Hylocereus undatus',
                'variety' => fake()->randomElement(['Thanh long ruột trắng', 'Thanh long ruột đỏ', 'Thanh long vàng']),
                'category' => 'fruit',
                'description' => 'Thanh long - trái cây xuất khẩu chủ lực',
                'typical_grow_duration_days' => fake()->numberBetween(180, 365),
            ],
            // Cây đậu (legume)
            [
                'name' => 'Đậu phộng',
                'code' => 'DAU_PHONG',
                'scientific_name' => 'Arachis hypogaea',
                'variety' => fake()->randomElement(['L14', 'L23', 'TK10', 'Sen lai']),
                'category' => 'legume',
                'description' => 'Đậu phộng - cây lấy dầu và thực phẩm',
                'typical_grow_duration_days' => fake()->numberBetween(90, 120),
            ],
            // Cây khác (other)
            [
                'name' => 'Mía',
                'code' => 'MIA',
                'scientific_name' => 'Saccharum officinarum',
                'variety' => fake()->randomElement(['ROC10', 'K84-200', 'VN84-4137', 'Suphanburi 7']),
                'category' => 'other',
                'description' => 'Mía - nguyên liệu sản xuất đường',
                'typical_grow_duration_days' => fake()->numberBetween(300, 365),
            ],
        ];

        $crop = fake()->randomElement($crops);

        return [
            'name' => $crop['name'],
            'code' => $crop['code'] . '_' . fake()->unique()->numerify('###'),
            'scientific_name' => $crop['scientific_name'],
            'variety' => $crop['variety'],
            'category' => $crop['category'],
            'description' => $crop['description'],
            'typical_grow_duration_days' => $crop['typical_grow_duration_days'],
            'default_yield_unit_id' => UnitOfMeasure::where('unit_type', 'weight')->inRandomOrder()->first()?->id,
            'is_active' => true,
        ];
    }

    /**
     * Cây lúa.
     */
    public function rice(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Lúa',
            'code' => 'LUA_' . fake()->unique()->numerify('###'),
            'scientific_name' => 'Oryza sativa',
            'variety' => fake()->randomElement(['IR50404', 'OM5451', 'Jasmine 85', 'ST24', 'ST25']),
            'category' => 'grain',
            'description' => 'Cây lúa nước - cây lương thực chính của Việt Nam',
            'typical_grow_duration_days' => fake()->numberBetween(90, 120),
        ]);
    }

    /**
     * Rau củ.
     */
    public function vegetable(): static
    {
        $vegetables = [
            ['name' => 'Cà chua', 'code' => 'CA_CHUA', 'scientific_name' => 'Solanum lycopersicum', 'duration' => 100],
            ['name' => 'Rau cải', 'code' => 'RAU_CAI', 'scientific_name' => 'Brassica rapa', 'duration' => 30],
            ['name' => 'Dưa leo', 'code' => 'DUA_LEO', 'scientific_name' => 'Cucumis sativus', 'duration' => 50],
        ];
        $veg = fake()->randomElement($vegetables);

        return $this->state(fn (array $attributes) => [
            'name' => $veg['name'],
            'code' => $veg['code'] . '_' . fake()->unique()->numerify('###'),
            'scientific_name' => $veg['scientific_name'],
            'category' => 'vegetable',
            'typical_grow_duration_days' => $veg['duration'],
        ]);
    }

    /**
     * Trái cây.
     */
    public function fruit(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Dưa hấu',
            'code' => 'DUA_HAU_' . fake()->unique()->numerify('###'),
            'scientific_name' => 'Citrullus lanatus',
            'variety' => fake()->randomElement(['Dưa hấu không hạt', 'Dưa hấu Hắc Mỹ Nhân']),
            'category' => 'fruit',
            'description' => 'Dưa hấu - trái cây mùa hè phổ biến',
            'typical_grow_duration_days' => 80,
        ]);
    }

    /**
     * Cây công nghiệp ngắn ngày.
     */
    public function shortCycle(): static
    {
        return $this->state(fn (array $attributes) => [
            'typical_grow_duration_days' => fake()->numberBetween(25, 45),
        ]);
    }

    /**
     * Cây dài ngày.
     */
    public function longCycle(): static
    {
        return $this->state(fn (array $attributes) => [
            'typical_grow_duration_days' => fake()->numberBetween(150, 365),
        ]);
    }

    /**
     * Cây không hoạt động.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

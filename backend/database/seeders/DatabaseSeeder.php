<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@soleilfarm.vn',
        ]);

        // Seed reference data
        $this->call([
            UnitOfMeasureSeeder::class,
            SeasonDefinitionSeeder::class,
            ActivityTypeSeeder::class,
            CropTypeSeeder::class,
            LandParcelSeeder::class,
            WaterSourceSeeder::class,
        ]);
    }
}

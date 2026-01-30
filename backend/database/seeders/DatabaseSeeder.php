<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user if not exists
        User::firstOrCreate(
            ['email' => 'admin@soleilfarm.vn'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
            ]
        );

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

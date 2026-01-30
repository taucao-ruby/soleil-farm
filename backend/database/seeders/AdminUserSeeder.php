<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Create or update admin user with known password.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@soleilfarm.vn'],
            [
                'name' => 'Admin',
                'email' => 'admin@soleilfarm.vn',
                'password' => Hash::make('password123'),
            ]
        );

        $this->command->info('Admin user created/updated:');
        $this->command->info('Email: admin@soleilfarm.vn');
        $this->command->info('Password: password123');
    }
}

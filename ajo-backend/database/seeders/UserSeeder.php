<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        // Menambahkan user admin
        User::create([
            'name' => 'Admin User',
            'username' => 'admin123',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
            'role_id' => 1, // Admin
            'status' => 'active', // Pastikan admin aktif
            'last_login' => now(), // Bisa di-set null atau waktu sekarang
            'metadata' => json_encode(['notes' => 'Super admin dengan akses penuh']), // Bisa kosong atau ada catatan tambahan
        ]);
    }
}

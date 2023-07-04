<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // create admin
        \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@makayastore.com',
            'user_type' => 'admin',
            'password' => bcrypt('admin'),
        ]);
    }
}

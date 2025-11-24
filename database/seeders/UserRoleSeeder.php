<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

// php artisan db:seed --class=UserRoleSeeder

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'admin',
                'role_description' => null,
            ],
            [
                'name' => 'Supervisor 1',
                'email' => 'supervisor1@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Building & Facilities',
            ],
            [
                'name' => 'Supervisor 2',
                'email' => 'supervisor2@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Flood Control Works',
            ],
            [
                'name' => 'Supervisor 3',
                'email' => 'supervisor3@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Parks & Public Spaces',
            ],
            [
                'name' => 'Supervisor 4',
                'email' => 'supervisor4@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Road Works',
            ],
            [
                'name' => 'Supervisor 5',
                'email' => 'supervisor5@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Streetlights & Electrical',
            ],
            [
                'name' => 'Supervisor 6',
                'email' => 'supervisor6@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Traffic & Signage',
            ],
            [
                'name' => 'Supervisor 7',
                'email' => 'supervisor7@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Waste Management',
            ],
            [
                'name' => 'Supervisor 8',
                'email' => 'supervisor8@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Water Supply & Plumbing',
            ],
            [
                'name' => 'Supervisor 9',
                'email' => 'supervisor9@gmail.com',
                'password' => 'DefaultPassword123!',
                'role' => 'supervisor',
                'role_description' => 'Others',
            ],
        ];

        foreach ($users as $data) {
            // Password will be auto-hashed by casts() definition in User model.
            User::updateOrCreate(['email' => $data['email']], $data);
        }
    }
}

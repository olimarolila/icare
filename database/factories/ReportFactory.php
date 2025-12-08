<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'ticket_id' => 'TKT-' . strtoupper($this->faker->unique()->bothify('????##')),
            'category' => $this->faker->randomElement(['Road', 'Garbage', 'Lighting']),
            'street' => $this->faker->streetName(),
            'location_name' => $this->faker->streetAddress(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'subject' => $this->faker->sentence(4),
            'status' => $this->faker->randomElement(['Pending', 'In Progress', 'Resolved']),
            'description' => $this->faker->sentence(),
            'images' => [],
            'user_id' => User::factory(),
            'submitted_at' => now(),
            'votes' => 0,
        ];
    }
}

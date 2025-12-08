<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportVoteFactory extends Factory
{
    protected $model = ReportVote::class;

    public function definition(): array
    {
        return [
            'report_id' => Report::factory(),
            'user_id' => User::factory(),
            'value' => $this->faker->randomElement([-1, 1]),
        ];
    }
}

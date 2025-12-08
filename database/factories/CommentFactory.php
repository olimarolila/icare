<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'report_id' => Report::factory(),
            'user_id' => User::factory(),
            'body' => $this->faker->sentence(),
        ];
    }
}

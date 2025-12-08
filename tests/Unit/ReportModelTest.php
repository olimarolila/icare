<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_report_relations(): void
    {
        $user = User::factory()->create();
        $report = Report::factory()->create(['user_id' => $user->id]);

        $comment = Comment::factory()->create([
            'report_id' => $report->id,
            'user_id' => $user->id,
        ]);

        $vote = ReportVote::factory()->create([
            'report_id' => $report->id,
            'user_id' => $user->id,
            'value' => 1,
        ]);

        $this->assertTrue($report->user->is($user));
        $this->assertTrue($report->comments->first()->is($comment));
        $this->assertTrue($report->votes()->first()->is($vote));
    }
}

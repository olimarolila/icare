<?php

namespace Tests\Unit;

use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportVoteModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_report_vote_relations(): void
    {
        $user = User::factory()->create();
        $report = Report::factory()->create(['user_id' => $user->id]);

        $vote = ReportVote::factory()->create([
            'report_id' => $report->id,
            'user_id' => $user->id,
            'value' => 1,
        ]);

        $this->assertTrue($vote->user->is($user));
        $this->assertTrue($vote->report->is($report));
    }
}

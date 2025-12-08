<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportVoteActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upvote_and_toggle_off_report(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create(['votes' => 0]);

        // First upvote should set votes to +1 and user_vote to 1
        $response = $this->actingAs($user)
            ->postJson(route('reports.vote', $report), ['direction' => 'up']);

        $response->assertStatus(200)
            ->assertJson([
                'votes' => 1,
                'user_vote' => 1,
            ]);

        $this->assertDatabaseHas('report_votes', [
            'report_id' => $report->id,
            'user_id' => $user->id,
            'value' => 1,
        ]);

        $report->refresh();
        $this->assertEquals(1, $report->votes);

        // Second upvote should toggle off (remove vote) and bring votes back to 0
        $response = $this->actingAs($user)
            ->postJson(route('reports.vote', $report), ['direction' => 'up']);

        $response->assertStatus(200)
            ->assertJson([
                'votes' => 0,
                'user_vote' => 0,
            ]);

        $this->assertDatabaseMissing('report_votes', [
            'report_id' => $report->id,
            'user_id' => $user->id,
        ]);

        $report->refresh();
        $this->assertEquals(0, $report->votes);
    }

    public function test_user_can_switch_vote_from_up_to_down(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create(['votes' => 0]);

        // Start with an upvote
        $this->actingAs($user)
            ->postJson(route('reports.vote', $report), ['direction' => 'up'])
            ->assertStatus(200)
            ->assertJson([
                'votes' => 1,
                'user_vote' => 1,
            ]);

        $report->refresh();
        $this->assertEquals(1, $report->votes);

        // Switch to downvote should subtract 2 (1 -> -1)
        $this->actingAs($user)
            ->postJson(route('reports.vote', $report), ['direction' => 'down'])
            ->assertStatus(200)
            ->assertJson([
                'votes' => -1,
                'user_vote' => -1,
            ]);

        $report->refresh();
        $this->assertEquals(-1, $report->votes);

        $this->assertDatabaseHas('report_votes', [
            'report_id' => $report->id,
            'user_id' => $user->id,
            'value' => -1,
        ]);
    }

    public function test_vote_endpoint_redirects_for_non_json_requests(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create(['votes' => 0]);

        $response = $this->actingAs($user)
            ->post(route('reports.vote', $report), ['direction' => 'up']);

        $response->assertRedirect();

        $report->refresh();
        $this->assertEquals(1, $report->votes);
    }
}

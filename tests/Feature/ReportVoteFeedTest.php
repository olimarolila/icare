<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportVoteFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_upvoted_feed_shows_only_upvoted_reports(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $otherUser = User::factory()->create(['role' => 'citizen']);

        $upvotedReport = Report::factory()->create();
        $downvotedReport = Report::factory()->create();
        $otherUserReport = Report::factory()->create();

        ReportVote::factory()->create([
            'user_id' => $user->id,
            'report_id' => $upvotedReport->id,
            'value' => 1,
        ]);

        ReportVote::factory()->create([
            'user_id' => $user->id,
            'report_id' => $downvotedReport->id,
            'value' => -1,
        ]);

        ReportVote::factory()->create([
            'user_id' => $otherUser->id,
            'report_id' => $otherUserReport->id,
            'value' => 1,
        ]);

        $response = $this->actingAs($user)
            ->get(route('citizen.reports.upvoted', ['perPage' => 10]));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Citizen/UpvotedReports')
                    ->has('reports.data', 1)
                    ->where('reports.data.0.id', $upvotedReport->id)
            );
    }

    public function test_citizen_downvoted_feed_shows_only_downvoted_reports(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);

        $upvotedReport = Report::factory()->create();
        $downvotedReport = Report::factory()->create();

        ReportVote::factory()->create([
            'user_id' => $user->id,
            'report_id' => $upvotedReport->id,
            'value' => 1,
        ]);

        ReportVote::factory()->create([
            'user_id' => $user->id,
            'report_id' => $downvotedReport->id,
            'value' => -1,
        ]);

        $response = $this->actingAs($user)
            ->get(route('citizen.reports.downvoted', ['perPage' => 10]));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Citizen/DownvotedReports')
                    ->has('reports.data', 1)
                    ->where('reports.data.0.id', $downvotedReport->id)
            );
    }
}

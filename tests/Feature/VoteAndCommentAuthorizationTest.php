<?php

namespace Tests\Feature;

use App\Models\Report;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoteAndCommentAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_vote_on_report(): void
    {
        $report = Report::factory()->create();

        $response = $this->post(route('reports.vote', $report), [
            'direction' => 'up',
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_guest_cannot_comment_on_report(): void
    {
        $report = Report::factory()->create();

        $response = $this->post(route('reports.comment', $report), [
            'body' => 'Test comment',
        ]);

        $response->assertRedirect(route('login'));
    }
}

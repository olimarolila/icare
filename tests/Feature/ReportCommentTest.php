<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportCommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_comment_on_report(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('reports.comment', $report), [
                'body' => 'This is a test comment.',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('comments', [
            'report_id' => $report->id,
            'user_id' => $user->id,
            'body' => 'This is a test comment.',
        ]);
    }

    public function test_comment_requires_body(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('reports.comment', $report), [
                'body' => '',
            ]);

        $response->assertSessionHasErrors('body');
        $this->assertDatabaseCount('comments', 0);
    }

    public function test_comment_endpoint_returns_json_when_requested(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create();

        $response = $this->actingAs($user)
            ->postJson(route('reports.comment', $report), [
                'body' => 'Json comment.',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'ok' => true,
            ]);

        $this->assertDatabaseHas('comments', [
            'report_id' => $report->id,
            'user_id' => $user->id,
            'body' => 'Json comment.',
        ]);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportsFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_any_user_can_filter_reports_by_all_filters(): void
    {
        $user = User::factory()->create();

        // Base date so we can control recent_days logic
        $now = now();

        // Old report (older than 30 days)
        Report::factory()->create([
            'user_id' => $user->id,
            'category' => 'Road Damage',
            'status' => 'Pending',
            'submitted_at' => $now->copy()->subDays(40),
            'votes' => 10,
        ]);

        // Recent reports within 7 days
        $within7_1 = Report::factory()->create([
            'user_id' => $user->id,
            'category' => 'Garbage',
            'status' => 'Resolved',
            'submitted_at' => $now->copy()->subDays(3),
            'votes' => 5,
        ]);

        $within7_2 = Report::factory()->create([
            'user_id' => $user->id,
            'category' => 'Garbage',
            'status' => 'Pending',
            'submitted_at' => $now->copy()->subDays(2),
            'votes' => 2,
        ]);

        // Recent but different category/status
        $other = Report::factory()->create([
            'user_id' => $user->id,
            'category' => 'Flooding',
            'status' => 'In Progress',
            'submitted_at' => $now->copy()->subDays(5),
            'votes' => 20,
        ]);

        // Filter using all 5 filters: Sort, Recent, Category, Status, Per page
        $response = $this->get(route('reports', [
            'category' => 'Garbage',
            'status' => 'Pending',
            'recent_days' => 7,
            'perPage' => 5,
            'sort' => 'submitted_at',
            'direction' => 'desc',
        ]));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) =>
            $page->component('Reports')
                ->has('reports.data', 1)
                ->where('reports.data.0.id', $within7_2->id)
                ->where('filters.sort', 'submitted_at')
                ->where('filters.direction', 'desc')
                ->where('filters.category', 'Garbage')
                ->where('filters.status', 'Pending')
                ->where('filters.recent_days', 7)
                ->where('filters.perPage', 5)
        );
    }

    public function test_sorting_by_votes_desc_returns_highest_voted_first(): void
    {
        $user = User::factory()->create();

        $lowVotes = Report::factory()->create([
            'user_id' => $user->id,
            'votes' => 1,
            'submitted_at' => now()->subDays(1),
        ]);

        $highVotes = Report::factory()->create([
            'user_id' => $user->id,
            'votes' => 50,
            'submitted_at' => now()->subDays(2),
        ]);

        $response = $this->get(route('reports', [
            'sort' => 'votes',
            'direction' => 'desc',
            'perPage' => 5,
        ]));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) =>
            $page->component('Reports')
                ->has('reports.data', 2)
                ->where('reports.data.0.id', $highVotes->id)
                ->where('reports.data.1.id', $lowVotes->id)
        );
    }

    public function test_reset_filters_returns_default_values(): void
    {
        // Hit the reports route with no query parameters to simulate reset/default state
        $response = $this->get(route('reports'));

        $response->assertStatus(200);

        $response->assertInertia(fn ($page) =>
            $page->component('Reports')
                ->where('filters.sort', 'submitted_at')
                ->where('filters.direction', 'desc')
                ->where('filters.category', null)
                ->where('filters.status', null)
                ->where('filters.recent_days', 0)
                ->where('filters.perPage', 3)
        );
    }
}

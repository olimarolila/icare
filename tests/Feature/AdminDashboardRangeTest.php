<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardRangeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_metrics_for_week_range(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        Carbon::setTestNow(Carbon::create(2025, 12, 8, 12));

        // Inside this week (relative to test now)
        Report::factory()->create(['status' => 'Resolved', 'submitted_at' => Carbon::now()->subDays(1)]);
        Report::factory()->create(['status' => 'Pending', 'submitted_at' => Carbon::now()->subDays(2)]);

        // Older than a week
        Report::factory()->create(['status' => 'Resolved', 'submitted_at' => Carbon::now()->subDays(10)]);

        $response = $this->actingAs($admin)
            ->get(route('admin.dashboard', ['range' => 'week']));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Admin/Dashboard')
                    ->where('metrics.total', 0)
            );
    }
}

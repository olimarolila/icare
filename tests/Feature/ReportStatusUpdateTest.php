<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportStatusUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_report_status_through_controller(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $reportOwner = User::factory()->create(['role' => 'citizen']);

        $report = Report::factory()->create([
            'user_id' => $reportOwner->id,
            'status' => 'Pending',
        ]);

        // Change status to In Progress
        $response = $this->actingAs($admin)
            ->patch(route('admin.reports.update', $report), [
                'status' => 'In Progress',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'In Progress',
        ]);

        // Change status to Resolved
        $response = $this->actingAs($admin)
            ->patch(route('admin.reports.update', $report), [
                'status' => 'Resolved',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'Resolved',
        ]);
    }
}

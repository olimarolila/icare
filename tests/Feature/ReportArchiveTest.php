<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportArchiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_archive_and_restore_report(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $citizen = User::factory()->create(['role' => 'citizen']);
        $report = Report::factory()->create([
            'user_id' => $citizen->id,
            'archived_at' => null,
            'archived_by' => null,
        ]);

        // Archive
        $response = $this->actingAs($admin)
            ->post(route('admin.reports.archive', $report));

        $response->assertRedirect(route('admin.reports'));

        $report->refresh();
        $this->assertNotNull($report->archived_at);
        $this->assertEquals($admin->id, $report->archived_by);

        // Restore
        $response = $this->actingAs($admin)
            ->post(route('admin.reports.restore', $report));

        $response->assertRedirect(route('admin.archives', ['tab' => 'reports']));

        $report->refresh();
        $this->assertNull($report->archived_at);
        $this->assertNull($report->archived_by);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArchiveRestoreActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_restore_archived_user_from_archives_page(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $archiver = User::factory()->create(['role' => 'admin']);

        $user = User::factory()->create([
            'archived_at' => now(),
            'archived_by' => $archiver->id,
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.users.restore', $user));

        $response->assertRedirect(route('admin.archives', ['tab' => 'users']));

        $user->refresh();
        $this->assertNull($user->archived_at);
        $this->assertNull($user->archived_by);
    }

    public function test_admin_can_restore_archived_report_from_archives_page(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $archiver = User::factory()->create(['role' => 'admin']);

        $report = Report::factory()->create([
            'archived_at' => now(),
            'archived_by' => $archiver->id,
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.reports.restore', $report));

        $response->assertRedirect(route('admin.archives', ['tab' => 'reports']));

        $report->refresh();
        $this->assertNull($report->archived_at);
        $this->assertNull($report->archived_by);
    }
}

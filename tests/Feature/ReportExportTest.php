<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_export_filtered_reports_to_csv(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $resolved = Report::factory()->create([
            'status' => 'Resolved',
            'ticket_id' => 'TKT-RESOLVED',
        ]);

        $pending = Report::factory()->create([
            'status' => 'Pending',
            'ticket_id' => 'TKT-PENDING',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.reports.export', [
                'status' => 'Resolved',
            ]));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $response->assertHeader('Content-Disposition');

        $content = $response->streamedContent();

        $this->assertStringContainsString('TKT-RESOLVED', $content);
        $this->assertStringNotContainsString('TKT-PENDING', $content);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArchiveFiltersTest extends TestCase
{
    use RefreshDatabase;

    public function test_archive_index_filters_users_and_reports(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $archivedUserMatch = User::factory()->create([
            'name' => 'Match User',
            'email' => 'match@example.com',
            'archived_at' => now(),
        ]);

        $archivedUserOther = User::factory()->create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'archived_at' => now(),
        ]);

        $reportMatch = Report::factory()->create([
            'ticket_id' => 'ARCH-001',
            'status' => 'Resolved',
            'archived_at' => now(),
        ]);

        $reportOther = Report::factory()->create([
            'ticket_id' => 'OTHER-001',
            'status' => 'Pending',
            'archived_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.archives', [
                'userSearch' => 'Match',
                'reportSearch' => 'ARCH',
                'reportStatus' => 'Resolved',
            ]));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Admin/Archives')
                    ->where('users.data', function ($users) use ($archivedUserMatch, $archivedUserOther) {
                        $ids = collect($users)->pluck('id')->all();
                        return in_array($archivedUserMatch->id, $ids) && ! in_array($archivedUserOther->id, $ids);
                    })
                    ->where('reports.data', function ($reports) use ($reportMatch, $reportOther) {
                        $ids = collect($reports)->pluck('id')->all();
                        return in_array($reportMatch->id, $ids) && ! in_array($reportOther->id, $ids);
                    })
            );
    }
}

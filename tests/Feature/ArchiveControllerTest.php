<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArchiveControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_shows_archived_users_and_reports(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $archivedUser = User::factory()->create(['archived_at' => now()]);
        $archiver = User::factory()->create();
        $archivedUser->update(['archived_by' => $archiver->id]);

        $reportOwner = User::factory()->create();
        $archivedReport = Report::factory()->create([
            'user_id' => $reportOwner->id,
            'archived_at' => now(),
            'archived_by' => $archiver->id,
        ]);
        
        $response = $this->actingAs($admin)->get(route('admin.archives'));

        $response->assertStatus(200)->assertInertia(fn ($page) =>
            $page->component('Admin/Archives')
        );
    }
}

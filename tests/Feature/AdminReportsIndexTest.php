<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReportsIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_reports_index_filters_and_sorts(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $r1 = Report::factory()->create([
            'ticket_id' => 'TKT-001',
            'category' => 'Road',
            'street' => 'Main Street',
            'location_name' => 'Downtown',
            'status' => 'Pending',
            'subject' => 'Subject A',
            'votes' => 5,
        ]);

        $r2 = Report::factory()->create([
            'ticket_id' => 'TKT-002',
            'category' => 'Garbage',
            'street' => 'Side Street',
            'location_name' => 'Suburb',
            'status' => 'Resolved',
            'subject' => 'Subject B',
            'votes' => 10,
        ]);

        // Filter by search + status, sort by votes asc
        $response = $this->actingAs($admin)
            ->get(route('admin.reports', [
                'search' => 'TKT-00',
                'status' => 'Resolved',
                'perPage' => 10,
                'sort' => 'votes',
                'direction' => 'asc',
            ]));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Admin/Reports')
                    ->has('reports.data', 1)
                    ->where('reports.data.0.id', $r2->id)
                    ->where('filters.search', 'TKT-00')
                    ->where('filters.status', 'Resolved')
                    ->where('filters.perPage', 10)
                    ->where('filters.sort', 'votes')
                    ->where('filters.direction', 'asc')
            );
    }
}

<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_submit_a_report(): void
    {
        /** @var \App\Models\User $citizen */
        $citizen = User::factory()->create(['role' => 'citizen']);

        $payload = [
            'category' => 'Road',
            'street' => 'Test Street',
            'location_name' => 'Test Location',
            'latitude' => 14.5995,
            'longitude' => 120.9842,
            'subject' => 'Pothole in the road',
            'description' => 'Large pothole causing traffic issues.',
        ];

        $response = $this->actingAs($citizen)
            ->post(route('reports.store'), $payload);

        $response->assertRedirect(route('reports'));

        $this->assertDatabaseCount('reports', 1);

        $report = Report::first();

        $this->assertNotNull($report->ticket_id);
        $this->assertEquals('Road', $report->category);
        $this->assertEquals('Test Street', $report->street);
        $this->assertEquals('Test Location', $report->location_name);
        $this->assertEquals('Pending', $report->status);
        $this->assertEquals($citizen->id, $report->user_id);
    }
}

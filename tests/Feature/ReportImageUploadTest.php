<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReportImageUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_images_are_uploaded_and_paths_saved(): void
    {
        /** @var \App\Models\User $citizen */
        $citizen = User::factory()->create(['role' => 'citizen']);

        $file1 = UploadedFile::fake()->image('photo1.jpg', 800, 600);
        $file2 = UploadedFile::fake()->image('photo2.png', 1600, 1200);

        $payload = [
            'category' => 'Road',
            'street' => 'Test Street',
            'location_name' => 'Test Location',
            'latitude' => 14.5,
            'longitude' => 120.9,
            'subject' => 'Image upload test',
            'description' => 'Testing image uploads.',
            'images' => [$file1, $file2],
        ];

        $response = $this->actingAs($citizen)
            ->post(route('reports.store'), $payload);

        $response->assertRedirect(route('reports'));

        $report = Report::first();
        $this->assertNotNull($report);
        $this->assertIsArray($report->images);
        $this->assertCount(2, $report->images);

        foreach ($report->images as $path) {
            $this->assertNotEmpty($path);
        }
    }
}

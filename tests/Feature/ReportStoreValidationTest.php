<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportStoreValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_requires_mandatory_fields(): void
    {
        /** @var \App\Models\User $citizen */
        $citizen = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($citizen)
            ->post(route('reports.store'), []);

        $response->assertSessionHasErrors([
            'category',
            'location_name',
            'latitude',
            'longitude',
            'subject',
        ]);
    }

    public function test_store_validates_coordinates_ranges(): void
    {
        /** @var \App\Models\User $citizen */
        $citizen = User::factory()->create(['role' => 'citizen']);

        $payload = [
            'category' => 'Road',
            'location_name' => 'Test',
            'subject' => 'Test',
            'latitude' => 200, // invalid
            'longitude' => 200, // invalid
        ];

        $response = $this->actingAs($citizen)
            ->post(route('reports.store'), $payload);

        $response->assertSessionHasErrors([
            'latitude',
            'longitude',
        ]);
    }

    public function test_store_rejects_invalid_image_types(): void
    {
        /** @var \App\Models\User $citizen */
        $citizen = User::factory()->create(['role' => 'citizen']);

        $payload = [
            'category' => 'Road',
            'location_name' => 'Test',
            'subject' => 'Test',
            'latitude' => 10,
            'longitude' => 10,
        ];

        $file = \Illuminate\Http\UploadedFile::fake()->create('document.pdf', 10, 'application/pdf');

        $response = $this->actingAs($citizen)
            ->post(route('reports.store'), array_merge($payload, [
                'images' => [$file],
            ]));

        $response->assertSessionHasErrors('images.0');
    }
}

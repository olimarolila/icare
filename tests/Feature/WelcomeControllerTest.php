<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_loads_with_reports(): void
    {
        $user = User::factory()->create();
        Report::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'Pending']);

        $response = $this->get('/');

        $response->assertStatus(200)->assertInertia(fn ($page) =>
            $page->component('Welcome')
        );
    }
}

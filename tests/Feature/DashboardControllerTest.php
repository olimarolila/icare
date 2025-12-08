<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_dashboard_requires_citizen_role(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($user)->get(route('citizen.dashboard'));

        $response->assertStatus(200)->assertInertia(fn ($page) =>
            $page->component('Citizen/Dashboard')
        );
    }

    public function test_admin_dashboard_requires_admin_role(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200)->assertInertia(fn ($page) =>
            $page->component('Admin/Dashboard')
        );
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessAndUserIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_archived_users_are_excluded_from_admin_index(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $active = User::factory()->create(['name' => 'Active User']);
        $archived = User::factory()->create([
            'name' => 'Archived User',
            'archived_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.users', [
                'perPage' => 20,
            ]));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Admin/Users')
                    ->has('users.data')
                    ->where('users.data', function ($users) use ($active, $archived) {
                        $ids = collect($users)->pluck('id')->all();
                        return in_array($active->id, $ids) && ! in_array($archived->id, $ids);
                    })
            );
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        /** @var \App\Models\User $citizen */
        $citizen = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($citizen)
            ->get(route('admin.dashboard'));

        $response->assertStatus(403);
    }
}

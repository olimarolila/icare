<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUsersControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_users_index_filters_by_search_and_role(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $target = User::factory()->create([
            'name' => 'John Admin',
            'email' => 'john@example.com',
            'role' => 'staff',
        ]);

        User::factory()->create([
            'name' => 'Jane Citizen',
            'email' => 'jane@example.com',
            'role' => 'citizen',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.users', [
                'search' => 'John',
                'role' => 'staff',
                'perPage' => 10,
                'sort' => 'name',
                'direction' => 'asc',
            ]));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) =>
                $page->component('Admin/Users')
                    ->has('users.data', 1)
                    ->where('users.data.0.id', $target->id)
                    ->where('filters.search', 'John')
                    ->where('filters.role', 'staff')
                    ->where('filters.perPage', 10)
                    ->where('filters.sort', 'name')
                    ->where('filters.direction', 'asc')
            );
    }

    public function test_admin_users_all_returns_json_list(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.users.all'));

        $response->assertStatus(200)
            ->assertJsonCount(4); // 3 + admin
    }

    public function test_admin_can_update_user(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $payload = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'staff',
            'role_description' => 'Staff member',
        ];

        $response = $this->actingAs($admin)
            ->patch(route('admin.users.update', $user), $payload);

        $response->assertRedirect(route('admin.users'));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'staff',
            'role_description' => 'Staff member',
        ]);
    }

    public function test_admin_can_archive_and_restore_user(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        // Archive (web)
        $response = $this->actingAs($admin)
            ->post(route('admin.users.archive', $user));

        $response->assertRedirect(route('admin.users'));

        $user->refresh();
        $this->assertNotNull($user->archived_at);
        $this->assertEquals($admin->id, $user->archived_by);

        // Restore
        $response = $this->actingAs($admin)
            ->post(route('admin.users.restore', $user));

        $response->assertRedirect(route('admin.archives', ['tab' => 'users']));

        $user->refresh();
        $this->assertNull($user->archived_at);
        $this->assertNull($user->archived_by);
    }

    public function test_admin_can_soft_delete_user_via_json_destroy(): void
    {
        /** @var \App\Models\User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $user));

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $user->refresh();
        $this->assertNotNull($user->archived_at);
        $this->assertEquals($admin->id, $user->archived_by);
    }
}

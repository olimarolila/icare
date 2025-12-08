<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_have_archived_by_user(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'archived_at' => now(),
            'archived_by' => $admin->id,
        ]);

        $this->assertTrue($user->archivedByUser->is($admin));
    }
}

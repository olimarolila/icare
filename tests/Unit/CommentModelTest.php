<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_comment_relations(): void
    {
        $user = User::factory()->create();
        $report = Report::factory()->create(['user_id' => $user->id]);

        $comment = Comment::factory()->create([
            'report_id' => $report->id,
            'user_id' => $user->id,
        ]);

        $this->assertTrue($comment->user->is($user));
        $this->assertTrue($comment->report->is($report));
    }
}

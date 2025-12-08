<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('banned')->default(false)->after('report_banned_by');
            $table->text('ban_reason')->nullable()->after('banned');
            $table->timestamp('banned_at')->nullable()->after('ban_reason');
            $table->foreignId('banned_by')->nullable()->constrained('users')->nullOnDelete()->after('banned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['banned_by']);
            $table->dropColumn(['banned', 'ban_reason', 'banned_at', 'banned_by']);
        });
    }
};

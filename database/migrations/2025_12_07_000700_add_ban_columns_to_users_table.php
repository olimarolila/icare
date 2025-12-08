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
            $table->boolean('report_banned')->default(false)->after('archived_by');
            $table->text('report_ban_reason')->nullable()->after('report_banned');
            $table->timestamp('report_banned_at')->nullable()->after('report_ban_reason');
            $table->foreignId('report_banned_by')->nullable()->constrained('users')->nullOnDelete()->after('report_banned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['report_banned_by']);
            $table->dropColumn(['report_banned', 'report_ban_reason', 'report_banned_at', 'report_banned_by']);
        });
    }
};

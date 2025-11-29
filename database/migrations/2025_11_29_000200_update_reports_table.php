<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'subject')) {
                $table->string('subject')->nullable()->after('street');
            }
            if (!Schema::hasColumn('reports', 'images')) {
                $table->json('images')->nullable()->after('description');
            }
            $table->string('status')->default('Pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            // Cannot reliably revert status default change without knowing original, set to Submitted
            $table->string('status')->default('Submitted')->change();
            if (Schema::hasColumn('reports', 'images')) {
                $table->dropColumn('images');
            }
            if (Schema::hasColumn('reports', 'subject')) {
                $table->dropColumn('subject');
            }
        });
    }
};

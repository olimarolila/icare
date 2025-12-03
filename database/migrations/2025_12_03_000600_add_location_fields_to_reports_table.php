<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'location_name')) {
                $table->string('location_name')->nullable()->after('street');
            }
            if (!Schema::hasColumn('reports', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('location_name');
            }
            if (!Schema::hasColumn('reports', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (Schema::hasColumn('reports', 'longitude')) {
                $table->dropColumn('longitude');
            }
            if (Schema::hasColumn('reports', 'latitude')) {
                $table->dropColumn('latitude');
            }
            if (Schema::hasColumn('reports', 'location_name')) {
                $table->dropColumn('location_name');
            }
        });
    }
};

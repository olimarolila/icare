<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public reports listing
Route::get('/reports', [ReportController::class, 'publicIndex'])->name('reports');

Route::get('/report-form', function () {
    return Inertia::render('ReportForm');
})->name('report.form');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin pages (protected)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::get('/admin/forum', function () {
        return Inertia::render('Admin/Forum');
    })->name('admin.forum');

    Route::get('/admin/reports', [ReportController::class, 'index'])->name('admin.reports');
    Route::get('/admin/reports/export', [ReportController::class, 'export'])->name('admin.reports.export');
    Route::patch('/admin/reports/{report}', [ReportController::class, 'update'])->name('admin.reports.update');

    Route::get('/admin/users', function () {
        return Inertia::render('Admin/Users');
    })->name('admin.users');
});

// Guest submission route for reports
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

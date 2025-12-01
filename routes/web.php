<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Storage;

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

// Fallback image serving (if storage:link not working on Windows). Restrict to reports folder only.
Route::get('/storage/reports/{filename}', function ($filename) {
    $path = 'reports/' . $filename;
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    return response()->file(storage_path('app/public/' . $path));
})->where('filename', '.*');

Route::get('/report-form', function () {
    return Inertia::render('ReportForm');
})->name('report.form');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin pages (protected - only admin role)
Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
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

// Authenticated non-admin features (all logged users)
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Voting and comments on reports
    Route::post('/reports/{report}/vote', [ReportController::class, 'vote'])->name('reports.vote');
    Route::post('/reports/{report}/comments', [ReportController::class, 'comment'])->name('reports.comment');
});

require __DIR__.'/auth.php';

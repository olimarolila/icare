<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Middleware\AdminMiddleware;

/*
|--------------------------------------------------------------------------
| Public Routes (Accessible by General Users / Guests)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'      => Route::has('login'),
        'canRegister'   => Route::has('register'),
        'laravelVersion'=> Application::VERSION,
        'phpVersion'    => PHP_VERSION,
    ]);
});

// Public reports listing (read-only for all)
Route::get('/reports', [ReportController::class, 'publicIndex'])->name('reports');

// Guest submission route for reports (no auth required)
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');

// Fallback image serving (public, but limited to reports folder)
Route::get('/storage/reports/{filename}', function ($filename) {
    $path = 'reports/' . $filename;
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    return response()->file(storage_path('app/public/' . $path));
})->where('filename', '.*');

// Static pages (public)
Route::get('/report-form', function () {
    return Inertia::render('ReportForm');
})->name('report.form');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');


/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Not Accessible to the General Public)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    // Dashboard – protected, not accessible by general users
    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->middleware('verified')->name('dashboard');

    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Voting and comments on reports
    Route::post('/reports/{report}/vote', [ReportController::class, 'vote'])->name('reports.vote');
    Route::post('/reports/{report}/comments', [ReportController::class, 'comment'])->name('reports.comment');
});


/*
|--------------------------------------------------------------------------
| Admin-Only Routes (Protected by Admin Middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', AdminMiddleware::class])->group(function () {
    Route::get('/dashboard', function () {
        // You can use Admin/Dashboard here if you want
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

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

/*
|--------------------------------------------------------------------------
| Auth Scaffolding Routes (Login, Register, etc.)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

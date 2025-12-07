<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Middleware\AdminMiddleware;

/*
|--------------------------------------------------------------------------
| Public Routes (Accessible by General Users / Guests)
|--------------------------------------------------------------------------
*/

Route::get('/', [WelcomeController::class, 'welcome']);

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

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');


/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Not Accessible to the General Public)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    Route::get('/citizen/dashboard', [DashboardController::class, 'citizen'])
        ->name('citizen.dashboard');

    Route::get('/citizen/reports/upvoted', [ReportController::class, 'upvoted'])
        ->name('citizen.reports.upvoted');

    Route::get('/citizen/reports/downvoted', [ReportController::class, 'downvoted'])
        ->name('citizen.reports.downvoted');

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

    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])
        ->name('admin.dashboard');

    Route::get('/admin/forum', function () {
        return Inertia::render('Admin/Forum');
    })->name('admin.forum');

    // Reports management
    Route::get('/admin/reports', [ReportController::class, 'index'])->name('admin.reports');
    Route::get('/admin/reports/export', [ReportController::class, 'export'])->name('admin.reports.export');
    Route::patch('/admin/reports/{report}', [ReportController::class, 'update'])->name('admin.reports.update');
    Route::post('/admin/reports/{report}/archive', [ReportController::class, 'archive'])->name('admin.reports.archive');
    Route::post('/admin/reports/{report}/restore', [ReportController::class, 'restore'])->name('admin.reports.restore');

    // Users management
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/users/all', [UserController::class, 'all'])->name('admin.users.all');
    Route::get('/admin/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::patch('/admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::post('/admin/users/{user}/archive', [UserController::class, 'archive'])->name('admin.users.archive');
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

    // Archives management
    Route::get('/admin/archives', [ArchiveController::class, 'index'])->name('admin.archives');
    Route::post('/admin/users/{user}/restore', [UserController::class, 'restore'])->name('admin.users.restore');
});

/*
|--------------------------------------------------------------------------
| Auth Scaffolding Routes (Login, Register, etc.)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

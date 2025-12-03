<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Http\Request;
use App\Models\User;
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

    Route::get('/admin/users', function (Request $request) {
        $perPage = (int) $request->input('perPage', 25);
        $search = $request->input('search');
        $role = $request->input('role');
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $allowedSorts = ['name', 'email', 'role', 'created_at'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'created_at';
        }
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $query = User::whereNull('archived_at'); // Exclude archived users
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($role) {
            $query->where('role', $role);
        }

        $users = $query->orderBy($sort, $direction)->paginate($perPage)->appends($request->query());

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'perPage' => $perPage,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    })->name('admin.users');

    // Return all users as JSON for client-side DataTables
    Route::get('/admin/users/all', function () {
        $users = User::select('id','name','email','role','role_description')->orderBy('name')->get();
        return response()->json($users);
    })->name('admin.users.all');

    // Edit form (inertia) for a single user
    Route::get('/admin/users/{user}/edit', function (User $user) {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    })->name('admin.users.edit');

    // Update user
    Route::patch('/admin/users/{user}', function (Request $request, User $user) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'nullable|string|max:50',
            'role_description' => 'nullable|string|max:255',
        ]);
        $user->update($data);
        return redirect()->route('admin.users');
    })->name('admin.users.update');

    // Archive user
    Route::post('/admin/users/{user}/archive', function (Request $request, User $user) {
        $user->update([
            'archived_at' => now(),
            'archived_by' => auth()->id(),
        ]);
        return redirect()->route('admin.users');
    })->name('admin.users.archive');

    // Delete user (keep for backward compatibility with DataTables)
    Route::delete('/admin/users/{user}', function (User $user) {
        $user->update([
            'archived_at' => now(),
            'archived_by' => auth()->id(),
        ]);
        return response()->json(['success' => true]);
    })->name('admin.users.destroy');

    // Archive report
    Route::post('/admin/reports/{report}/archive', function (Request $request, $reportId) {
        $report = \App\Models\Report::findOrFail($reportId);
        $report->update([
            'archived_at' => now(),
            'archived_by' => auth()->id(),
        ]);
        return redirect()->route('admin.reports');
    })->name('admin.reports.archive');

    // Restore user
    Route::post('/admin/users/{user}/restore', function (Request $request, User $user) {
        $user->update([
            'archived_at' => null,
            'archived_by' => null,
        ]);
        return redirect()->route('admin.archives', ['tab' => 'users']);
    })->name('admin.users.restore');

    // Restore report
    Route::post('/admin/reports/{report}/restore', function (Request $request, $reportId) {
        $report = \App\Models\Report::findOrFail($reportId);
        $report->update([
            'archived_at' => null,
            'archived_by' => null,
        ]);
        return redirect()->route('admin.archives', ['tab' => 'reports']);
    })->name('admin.reports.restore');

    // Unified Archives Page with Tabs
    Route::get('/admin/archives', function (Request $request) {
        $tab = $request->input('tab', 'users');
        
        // User filters
        $userPerPage = (int) $request->input('userPerPage', 25);
        $userSearch = $request->input('userSearch');
        $userSort = $request->input('userSort', 'archived_at');
        $userDirection = $request->input('userDirection', 'desc');
        
        $allowedUserSorts = ['name', 'email', 'role', 'archived_at'];
        if (!in_array($userSort, $allowedUserSorts)) {
            $userSort = 'archived_at';
        }
        $userDirection = in_array($userDirection, ['asc', 'desc']) ? $userDirection : 'desc';

        // Report filters
        $reportPerPage = (int) $request->input('reportPerPage', 10);
        $reportSearch = $request->input('reportSearch');
        $reportCategory = $request->input('reportCategory');
        $reportSort = $request->input('reportSort', 'archived_at');
        $reportDirection = $request->input('reportDirection', 'desc');
        
        $allowedReportSorts = ['ticket_id', 'category', 'status', 'archived_at'];
        if (!in_array($reportSort, $allowedReportSorts)) {
            $reportSort = 'archived_at';
        }
        $reportDirection = in_array($reportDirection, ['asc', 'desc']) ? $reportDirection : 'desc';

        // Query archived users
        $usersQuery = User::whereNotNull('archived_at')->with('archivedByUser');
        if ($userSearch) {
            $usersQuery->where(function ($q) use ($userSearch) {
                $q->where('name', 'like', "%{$userSearch}%")
                    ->orWhere('email', 'like', "%{$userSearch}%");
            });
        }
        $users = $usersQuery->orderBy($userSort, $userDirection)->paginate($userPerPage, ['*'], 'page')->appends($request->query());

        // Query archived reports
        $reportsQuery = \App\Models\Report::whereNotNull('archived_at')->with('archivedByUser');
        if ($reportSearch) {
            $reportsQuery->where(function ($q) use ($reportSearch) {
                $q->where('ticket_id', 'like', "%{$reportSearch}%")
                    ->orWhere('description', 'like', "%{$reportSearch}%")
                    ->orWhere('street', 'like', "%{$reportSearch}%");
            });
        }
        if ($reportCategory) {
            $reportsQuery->where('category', 'like', "%{$reportCategory}%");
        }
        $reports = $reportsQuery->orderBy($reportSort, $reportDirection)->paginate($reportPerPage, ['*'], 'page')->appends($request->query());

        return Inertia::render('Admin/Archives', [
            'users' => $users,
            'reports' => $reports,
            'activeTab' => $tab,
            'filters' => [
                'userSearch' => $userSearch,
                'userPerPage' => $userPerPage,
                'userSort' => $userSort,
                'userDirection' => $userDirection,
                'reportSearch' => $reportSearch,
                'reportCategory' => $reportCategory,
                'reportPerPage' => $reportPerPage,
                'reportSort' => $reportSort,
                'reportDirection' => $reportDirection,
            ],
        ]);
    })->name('admin.archives');
});

/*
|--------------------------------------------------------------------------
| Auth Scaffolding Routes (Login, Register, etc.)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

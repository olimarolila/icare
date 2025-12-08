<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function welcome()
    {
        $reports = Report::with('user')
            ->whereNull('archived_at')
            ->orderByDesc('votes')
            ->orderByDesc('created_at')
            ->take(3) // top 3 most-voted reports for welcome page
            ->get();

        $resolvedCount = Report::where('status', 'Resolved')->whereNull('archived_at')->count();
        $inProgressCount = Report::where('status', 'In Progress')->whereNull('archived_at')->count();
        $pendingCount = Report::where('status', 'Pending')->whereNull('archived_at')->count();

        return Inertia::render('Welcome', [
            'auth' => ['user' => Auth::user()],
            'reports' => $reports,
            'statusCounts' => [
                'resolved' => $resolvedCount,
                'inProgress' => $inProgressCount,
                'pending' => $pendingCount,
            ],
        ]);
    }
}

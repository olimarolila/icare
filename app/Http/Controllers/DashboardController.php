<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->input('range', 'week'); // week|month|year|all

        // Determine start and end dates based on range
        $start = null;
        $end = Carbon::now()->endOfDay();

        if ($range === 'week') {
            $start = Carbon::now()->startOfWeek();
        } elseif ($range === 'month') {
            $start = Carbon::now()->startOfMonth();
        } elseif ($range === 'year') {
            $start = Carbon::now()->startOfYear();
        }
        // For 'all', $start remains null, which means no date filter

        // Base query excludes archived
        $baseQuery = Report::whereNull('archived_at');
        if ($start) {
            $baseQuery = $baseQuery->where('submitted_at', '>=', $start);
        }

        // Total counts
        $totalReports = (clone $baseQuery)->count();
        $resolvedCount = (clone $baseQuery)->where('status', 'Resolved')->count();
        $inProgressCount = (clone $baseQuery)->where('status', 'In Progress')->count();
        $pendingCount = (clone $baseQuery)->where('status', 'Pending')->count();

        // Category breakdown
        $categoryBreakdown = (clone $baseQuery)
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total' => $totalReports,
                'resolved' => $resolvedCount,
                'inProgress' => $inProgressCount,
                'pending' => $pendingCount,
            ],
            'categoryBreakdown' => $categoryBreakdown,
            'range' => $range,
            'dateRange' => [
                'start' => $start ? $start->format('M d, Y') : null,
                'end' => $end->format('M d, Y'),
            ],
        ]);
    }
}

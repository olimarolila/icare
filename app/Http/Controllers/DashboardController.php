<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function citizen(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'citizen') {
            abort(403);
        }

        $reports = Report::where('user_id', $user->id)
            ->whereNull('archived_at')
            ->orderByDesc('submitted_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'ticket_id' => $report->ticket_id,
                    'subject' => $report->subject,
                    'status' => $report->status,
                    'category' => $report->category,
                    'street' => $report->street,
                    'submitted_at' => optional($report->submitted_at)->toDateTimeString(),
                    'created_at' => optional($report->created_at)->toDateTimeString(),
                ];
            });

        return Inertia::render('Citizen/Dashboard', [
            'reports' => $reports,
        ]);
    }

    public function admin(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            abort(403);
        }

        $range = $request->input('range', 'week'); // week|month|year|all|custom
        $customMonth = $request->input('customMonth'); // format: YYYY-MM
        $customYear = $request->input('customYear'); // format: YYYY
        $fromDate = $request->input('fromDate'); // format: YYYY-MM-DD
        $toDate = $request->input('toDate'); // format: YYYY-MM-DD

        // Determine start and end dates based on range
        $start = null;
        $end = Carbon::now()->endOfDay();

        if ($range === 'week') {
            $start = Carbon::now()->startOfWeek();
        } elseif ($range === 'month' && !$customMonth) {
            $start = Carbon::now()->startOfMonth();
        } elseif ($range === 'month' && $customMonth) {
            // Handle custom month selection (YYYY-MM format)
            $date = Carbon::createFromFormat('Y-m', $customMonth);
            $start = $date->startOfMonth();
            $end = $date->endOfMonth()->endOfDay();
        } elseif ($range === 'year' && !$customYear) {
            $start = Carbon::now()->startOfYear();
        } elseif ($range === 'year' && $customYear) {
            // Handle custom year selection
            $date = Carbon::createFromFormat('Y', $customYear);
            $start = $date->startOfYear();
            $end = $date->endOfYear()->endOfDay();
        } elseif ($range === 'custom') {
            // Handle custom date range
            if ($fromDate) {
                $start = Carbon::createFromFormat('Y-m-d', $fromDate)->startOfDay();
            }
            if ($toDate) {
                $end = Carbon::createFromFormat('Y-m-d', $toDate)->endOfDay();
            }
        }
        // For 'all', $start remains null, which means no date filter

        // Base query excludes archived
        $baseQuery = Report::whereNull('archived_at');
        if ($start) {
            $baseQuery = $baseQuery->where('submitted_at', '>=', $start)
                                    ->where('submitted_at', '<=', $end);
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
            'customMonth' => $customMonth,
            'customYear' => $customYear,
            'fromDate' => $fromDate,
            'toDate' => $toDate,
            'dateRange' => [
                'start' => $start ? $start->format('M d, Y') : null,
                'end' => $end->format('M d, Y'),
            ],
        ]);
    }
}

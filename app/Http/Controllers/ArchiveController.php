<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    /**
     * Display the unified archives page with tabs for users and reports.
     */
    public function index(Request $request)
    {
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
        $reportStatus = $request->input('reportStatus');
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
        $reportsQuery = Report::whereNotNull('archived_at')->with('archivedByUser');
        if ($reportSearch) {
            $reportsQuery->where(function ($q) use ($reportSearch) {
                $q->where('ticket_id', 'like', "%{$reportSearch}%")
                    ->orWhere('category', 'like', "%{$reportSearch}%")
                    ->orWhere('street', 'like', "%{$reportSearch}%")
                    ->orWhere('subject', 'like', "%{$reportSearch}%")
                    ->orWhere('description', 'like', "%{$reportSearch}%")
                    ->orWhere('status', 'like', "%{$reportSearch}%");
            });
        }
        if ($reportStatus) {
            $reportsQuery->where('status', $reportStatus);
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
                'reportStatus' => $reportStatus,
                'reportPerPage' => $reportPerPage,
                'reportSort' => $reportSort,
                'reportDirection' => $reportDirection,
            ],
        ]);
    }

    /**
     * Restore the specified archived user.
     */
    public function restoreUser(Request $request, User $user)
    {
        $user->update([
            'archived_at' => null,
            'archived_by' => null,
        ]);
        
        return redirect()->route('admin.archives', ['tab' => 'users'])
            ->with('success', 'User restored successfully.');
    }

    /**
     * Restore the specified archived report.
     */
    public function restoreReport(Request $request, Report $report)
    {
        $report->update([
            'archived_at' => null,
            'archived_by' => null,
        ]);
        
        return redirect()->route('admin.archives', ['tab' => 'reports'])
            ->with('success', 'Report restored successfully.');
    }
}

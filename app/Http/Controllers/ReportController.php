<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportVote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     */
    public function index(Request $request)
    {
        $perPage = (int)$request->input('perPage', 10);
        $search = $request->input('search');
        $sort = $request->input('sort', 'submitted_at');
        $direction = $request->input('direction', 'desc');
        $filters = [
            'ticket_id' => $request->input('ticket_id'),
            'category' => $request->input('category'),
            'street' => $request->input('street'),
            'location_name' => $request->input('location_name'),
            'status' => $request->input('status'),
        ];

        // Sortable columns whitelist
        $allowedSorts = ['id', 'ticket_id', 'category', 'street', 'location_name', 'status', 'submitted_at'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'submitted_at';
        }
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $query = Report::query()->whereNull('archived_at')->orderBy($sort, $direction); // Exclude archived reports

        // Global search across several columns
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_id', 'like', "%$search%")
                  ->orWhere('category', 'like', "%$search%")
                  ->orWhere('street', 'like', "%$search%")
                  ->orWhere('location_name', 'like', "%$search%")
                  ->orWhere('subject', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhere('status', 'like', "%$search%");
            });
        }

        // Column filters
        foreach ($filters as $column => $value) {
            if ($value !== null && $value !== '') {
                $query->where($column, 'like', "%$value%");
            }
        }

        $reports = $query
            ->select(['id', 'ticket_id', 'category', 'street', 'location_name', 'latitude', 'longitude', 'subject', 'status', 'submitted_at', 'description', 'images'])
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'filters' => [
                'search' => $search,
                'ticket_id' => $filters['ticket_id'],
                'category' => $filters['category'],
                'street' => $filters['street'],
                'location_name' => $filters['location_name'],
                'status' => $filters['status'],
                'perPage' => $perPage,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    /**
     * Store a newly created report.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'location_name' => 'required|string|max:255',
            'latitude' => 'required|numeric|min:-90|max:90',
            'longitude' => 'required|numeric|min:-180|max:180',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        $ticketId = 'TKT-' . strtoupper(uniqid());

        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $paths[] = $img->store('reports', 'public');
            }
        }

        $report = Report::create([
            'ticket_id' => $ticketId,
            'category' => $validated['category'],
            'street' => $validated['street'] ?? $validated['location_name'],
            'location_name' => $validated['location_name'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'subject' => $validated['subject'],
            'status' => 'Pending',
            'description' => $validated['description'] ?? null,
            'images' => $paths,
            'user_id' => auth()->id(),
            'submitted_at' => now(),
        ]);

        return redirect()->route('reports')->with('success', 'Report submitted. Ticket: ' . $report->ticket_id);
    }

    /**
     * Update the status of a report.
     */
    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,In Progress,Resolved',
        ]);
        $report->update(['status' => $validated['status']]);
        return redirect()->back()->with('success', 'Status updated');
    }

    /**
     * Export reports to CSV
     */
    public function export(Request $request)
    {
        $search = $request->input('search');
        $filters = [
            'ticket_id' => $request->input('ticket_id'),
            'category' => $request->input('category'),
            'street' => $request->input('street'),
            'status' => $request->input('status'),
        ];

        $query = Report::query()->latest('submitted_at');

        // Apply same filters as index
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_id', 'like', "%$search%")
                  ->orWhere('category', 'like', "%$search%")
                  ->orWhere('street', 'like', "%$search%")
                  ->orWhere('subject', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhere('status', 'like', "%$search%");
            });
        }

        foreach ($filters as $column => $value) {
            if ($value !== null && $value !== '') {
                $query->where($column, 'like', "%$value%");
            }
        }

        $reports = $query->get(['id', 'ticket_id', 'category', 'street', 'location_name', 'latitude', 'longitude', 'subject', 'status', 'submitted_at', 'description']);

        $filename = 'reports_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($reports) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Ticket ID', 'Category', 'Street', 'Location Name', 'Latitude', 'Longitude', 'Subject', 'Status', 'Date Submitted', 'Description']);

            foreach ($reports as $report) {
                fputcsv($file, [
                    $report->id,
                    $report->ticket_id,
                    $report->category,
                    $report->street,
                    $report->location_name,
                    $report->latitude,
                    $report->longitude,
                    $report->subject,
                    $report->status,
                    $report->submitted_at ? $report->submitted_at->format('Y-m-d H:i:s') : '',
                    $report->description,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Public listing of reports (non-admin view)
     */
    public function publicIndex()
    {
        $userId = auth()->id();

        $reports = Report::with([
                'user:id,name',
                'comments' => function ($q) {
                    $q->with('user:id,name')->latest()->take(20);
                },
            ])
            ->withCount('comments')
            ->when($userId, function ($q) use ($userId) {
                $q->addSelect(['user_vote' => ReportVote::select('value')
                    ->whereColumn('report_id', 'reports.id')
                    ->where('user_id', $userId)
                    ->limit(1)
                ]);
            })
            ->latest('submitted_at')
            ->get(['id','ticket_id','category','street','location_name','latitude','longitude','subject','status','submitted_at','description','images','user_id','votes']);

        return Inertia::render('Reports', [
            'reports' => $reports,
        ]);
    }

    /**
     * Upvote or downvote a report (auth required)
     */
    public function vote(Request $request, Report $report)
    {
        $data = $request->validate([
            'direction' => 'required|in:up,down',
        ]);

        $userId = $request->user()->id;
        $desired = $data['direction'] === 'up' ? 1 : -1;

        $vote = ReportVote::where('report_id', $report->id)
            ->where('user_id', $userId)
            ->first();

        $delta = 0;
        if ($vote) {
            if ($vote->value === $desired) {
                // Toggle off to neutral
                $delta = -$vote->value;
                $vote->delete();
            } else {
                // Switch from -1 to +1 or +1 to -1
                $delta = $desired - $vote->value; // will be ±2
                $vote->update(['value' => $desired]);
            }
        } else {
            ReportVote::create([
                'report_id' => $report->id,
                'user_id' => $userId,
                'value' => $desired,
            ]);
            $delta = $desired; // ±1
        }

        if ($delta !== 0) {
            $report->increment('votes', $delta);
            $report->refresh();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'votes' => $report->votes,
                'user_vote' => ReportVote::where('report_id', $report->id)->where('user_id', $userId)->value('value') ?? 0,
            ]);
        }
        return redirect()->back();
    }

    /**
     * Add a comment to a report (auth required)
     */
    public function comment(Request $request, Report $report)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:500',
        ]);

        $report->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        if ($request->wantsJson()) {
            return response()->json(['ok' => true]);
        }
        return redirect()->back();
    }
}


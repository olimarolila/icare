<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportVote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     */
    public function index(Request $request)
    {
        $perPage = (int)$request->input('perPage', 10);
        $search = $request->input('search');
        $sort = $request->input('sort', 'votes');
        $direction = $request->input('direction', 'desc');
        $filters = [
            'ticket_id' => $request->input('ticket_id'),
            'category' => $request->input('category'),
            'street' => $request->input('street'),
            'location_name' => $request->input('location_name'),
            'status' => $request->input('status'),
        ];

        // Sortable columns whitelist
        $allowedSorts = ['id', 'ticket_id', 'category', 'street', 'location_name', 'status', 'submitted_at', 'subject', 'votes'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'votes';
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
            ->with('user:id,name,email')
            ->select(['id', 'ticket_id', 'category', 'street', 'location_name', 'latitude', 'longitude', 'subject', 'status', 'submitted_at', 'description', 'images', 'votes', 'user_id'])
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
            // Initialize Intervention Image manager with GD driver (v3 syntax)
            $manager = new ImageManager(new Driver());

            // Watermark image path (public/images/logo_cat3.png)
            $watermarkPath = public_path('images/logo_cat3.PNG');
            $watermarkOriginal = null;

            if (is_file($watermarkPath)) {
                $watermarkOriginal = $manager->read($watermarkPath);
            }

            foreach ($request->file('images') as $img) {
                $imagePath = $img->getRealPath();
                $image = $manager->read($imagePath);

                // Manually handle orientation since Intervention v3 removed orientate()
                if (function_exists('exif_read_data')) {
                    $exif = @exif_read_data($imagePath);
                    $orientation = $exif['Orientation'] ?? null;
                    switch ($orientation) {
                        case 3:
                            $image = $image->rotate(180);
                            break;
                        case 6:
                            $image = $image->rotate(-90);
                            break;
                        case 8:
                            $image = $image->rotate(90);
                            break;
                        default:
                            break; // already upright
                    }
                }

                // Resize/scale only if larger than 1280x960 (preserve smaller images)
                $maxWidth = 1280;
                $maxHeight = 960;

                if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
                    $scale = min($maxWidth / $image->width(), $maxHeight / $image->height());
                    $image = $image->resize(
                        (int) round($image->width() * $scale),
                        (int) round($image->height() * $scale)
                    );
                }

                // Apply watermark (bottom-right) if available
                if ($watermarkOriginal) {
                    // Scale watermark relative to image width (about 10% width)
                    $wmWidth = (int) round($image->width() * 0.10);
                    $wmHeight = (int) round(
                        $watermarkOriginal->height() * ($wmWidth / $watermarkOriginal->width())
                    );

                    // Use a cloned copy so original watermark is not permanently resized
                    $wm = (clone $watermarkOriginal)->resize($wmWidth, $wmHeight);

                    // Place bottom-right with 12px margin and set opacity via place()
                    $image = $image->place($wm, 'bottom-right', 12, 12, 40);
                }

                // Ensure destination filename with original extension
                $ext = strtolower($img->getClientOriginalExtension() ?: 'jpg');

                if ($ext === 'jpeg') {
                    $ext = 'jpg';
                }

                if (!in_array($ext, ['jpg', 'png', 'webp'], true)) {
                    $ext = 'jpg';
                }

                $filename = Str::uuid()->toString() . '.' . $ext;
                $relativePath = 'reports/' . $filename;
                $absolutePath = storage_path('app/public/' . $relativePath);

                // Create directory if needed
                if (!is_dir(dirname($absolutePath))) {
                    mkdir(dirname($absolutePath), 0755, true);
                }

                // Save with quality (applies to jpg/webp; png mapped appropriately by driver)
                $image->save($absolutePath, 85);

                $paths[] = $relativePath;
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
            'user_id' => Auth::id(),
            'submitted_at' => now(),
        ]);

        return redirect()->route('reports')->with('success', 'Report submitted successfully! Ticket ID: ' . $report->ticket_id);
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
        return redirect()->back()->with('success', 'Report status updated successfully.');
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
    public function publicIndex(Request $request)
    {
        $userId = Auth::id();
        $perPage = (int) $request->input('perPage', 3);
        $perPage = max(3, min($perPage, 50));

        $sort = $request->input('sort', 'submitted_at');
        $direction = $request->input('direction', 'desc');
        $category = $request->input('category');
        $status = $request->input('status');
        $recentDays = (int) $request->input('recent_days', 0);

        $allowedSorts = ['submitted_at', 'votes'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'submitted_at';
        }
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $reports = Report::with([
                'user:id,name',
                'comments' => function ($q) {
                    $q->with('user:id,name')->latest()->take(20);
                },
            ])
            ->withCount('comments')
            ->whereNull('archived_at')
            ->when($userId, function ($q) use ($userId) {
                $q->addSelect(['user_vote' => ReportVote::select('value')
                    ->whereColumn('report_id', 'reports.id')
                    ->where('user_id', $userId)
                    ->limit(1)
                ]);
            })
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($recentDays > 0, function ($q) use ($recentDays) {
                $q->where('submitted_at', '>=', now()->subDays($recentDays));
            })
            ->orderBy($sort === 'votes' ? 'votes' : 'submitted_at', $direction)
            ->paginate($perPage, [
                'id',
                'ticket_id',
                'category',
                'street',
                'location_name',
                'latitude',
                'longitude',
                'subject',
                'status',
                'submitted_at',
                'description',
                'images',
                'user_id',
                'votes',
            ])
            ->appends($request->query());

        return Inertia::render('Reports', [
            'reports' => $reports,
            'filters' => [
                'sort' => $sort,
                'direction' => $direction,
                'category' => $category,
                'status' => $status,
                'recent_days' => $recentDays,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function upvoted(Request $request)
    {
        return $this->renderUserVoteFeed(
            $request,
            1,
            'Citizen/UpvotedReports',
            'No upvoted post yet.'
        );
    }

    public function downvoted(Request $request)
    {
        return $this->renderUserVoteFeed(
            $request,
            -1,
            'Citizen/DownvotedReports',
            'No downvoted post yet.'
        );
    }

    protected function renderUserVoteFeed(Request $request, int $voteValue, string $view, string $emptyMessage)
    {
        $user = $request->user();
        if (!$user) {
            abort(403);
        }

        $perPage = (int) $request->input('perPage', 5);
        $perPage = max(3, min($perPage, 20));

        $reports = Report::with([
                'user:id,name',
                'comments' => function ($q) {
                    $q->with('user:id,name')->latest()->take(20);
                },
            ])
            ->withCount('comments')
            ->whereNull('archived_at')
            ->whereHas('votes', function ($q) use ($user, $voteValue) {
                $q->where('user_id', $user->id)->where('value', $voteValue);
            })
            ->select('reports.*')
            ->addSelect(['user_vote' => ReportVote::select('value')
                ->whereColumn('report_id', 'reports.id')
                ->where('user_id', $user->id)
                ->limit(1)
            ])
            ->orderBy('submitted_at', 'desc')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render($view, [
            'reports' => $reports,
            'emptyMessage' => $emptyMessage,
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
        return redirect()->back()->with('success', 'Vote recorded successfully.');
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
        return redirect()->back()->with('success', 'Comment added successfully.');
    }

    /**
     * Archive the specified report.
     */
    public function archive(Request $request, Report $report)
    {
        $report->update([
            'archived_at' => now(),
			'archived_by' => Auth::id(),
        ]);

        return redirect()->route('admin.reports')->with('success', 'Report archived successfully.');
    }

    /**
     * Restore the specified archived report.
     */
    public function restore(Request $request, Report $report)
    {
        $report->update([
            'archived_at' => null,
            'archived_by' => null,
        ]);

        return redirect()->route('admin.archives', ['tab' => 'reports'])
            ->with('success', 'Report restored successfully.');
    }
}


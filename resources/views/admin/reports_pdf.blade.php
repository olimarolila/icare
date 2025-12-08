<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reports Export</title>
    <style>
        body { font-family: 'Arial', sans-serif; font-size: 12px; }
        h1 { text-align: center; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; font-size: 11px; }
        th { background: #f0f0f0; }
        .meta { font-size: 11px; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>iCARE Reports</h1>
    <div class="meta">
        @if($from || $to)
            Date range:
            {{ $from ? \Carbon\Carbon::parse($from)->toDateString() : 'Any' }}
            –
            {{ $to ? \Carbon\Carbon::parse($to)->toDateString() : 'Any' }}
        @else
            All dates
        @endif
        <br>
        Generated at: {{ now()->toDateTimeString() }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Ticket ID</th>
                <th>Posted By</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Street / Location</th>
                <th>Status</th>
                <th>Votes</th>
                <th>Date Submitted</th>
            </tr>
        </thead>
        <tbody>
        @forelse($reports as $report)
            <tr>
                <td>{{ $report->ticket_id }}</td>
                <td>{{ optional($report->user)->name ?? 'Guest' }}</td>
                <td>{{ $report->category }}</td>
                <td>{{ \Illuminate\Support\Str::limit($report->subject, 50) }}</td>
                <td>{{ $report->street ?? $report->location_name }}</td>
                <td>{{ $report->status }}</td>
                <td>{{ $report->votes }}</td>
                <td>{{ optional($report->submitted_at)->format('Y-m-d H:i') }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="8" style="text-align:center;">No reports in this range.</td>
            </tr>
        @endforelse
        </tbody>
    </table>
</body>
</html>

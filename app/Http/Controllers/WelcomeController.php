<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function welcome()
    {
        $reports = Report::with('user')
            ->orderByDesc('votes')
            ->orderByDesc('created_at')
            ->take(4) // top 4 most-voted for welcome page
            ->get();

        return Inertia::render('Welcome', [
            'auth' => ['user' => auth()->user()],
            'reports' => $reports,
        ]);
    }
}

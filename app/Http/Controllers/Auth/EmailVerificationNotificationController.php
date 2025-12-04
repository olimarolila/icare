<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $routeName = $request->user() && $request->user()->role === 'admin'
            ? 'admin.dashboard'
            : 'citizen.dashboard';

        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route($routeName, absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}

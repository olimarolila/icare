<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of non-archived users with filters and pagination.
     */
    public function index(Request $request)
    {
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
    }

    /**
     * Return all users as JSON for client-side DataTables.
     */
    public function all()
    {
        $users = User::select('id', 'name', 'email', 'role', 'role_description')
            ->orderBy('name')
            ->get();
        return response()->json($users);
    }

    /**
     * Archive the specified user.
     */
    public function archive(Request $request, User $user)
    {
        $user->update([
			'archived_at' => now(),
			'archived_by' => Auth::id(),
        ]);
        
        return redirect()->route('admin.users')->with('success', 'User archived successfully.');
    }

    /**
     * Delete/Archive the specified user (JSON response for DataTables).
     */
    public function destroy(User $user)
    {
        $user->update([
			'archived_at' => now(),
			'archived_by' => Auth::id(),
        ]);
        
        return response()->json(['success' => true]);
    }

    /**
     * Restore the specified archived user.
     */
    public function restore(Request $request, User $user)
    {
        $user->update([
            'archived_at' => null,
            'archived_by' => null,
        ]);
        
        return redirect()->route('admin.archives', ['tab' => 'users'])->with('success', 'User restored successfully.');
    }

    /**
     * Ban a user from posting reports.
     */
    public function ban(Request $request, User $user)
    {
        $data = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user->update([
            'report_banned' => true,
            'report_ban_reason' => $data['reason'],
            'report_banned_at' => now(),
            'report_banned_by' => auth()->id(),
        ]);

        return redirect()->route('admin.users')->with('success', "User {$user->name} has been banned from posting reports.");
    }

    /**
     * Unban a user from posting reports.
     */
    public function unban(User $user)
    {
        $user->update([
            'report_banned' => false,
            'report_ban_reason' => null,
            'report_banned_at' => null,
            'report_banned_by' => null,
        ]);

        return redirect()->route('admin.users')->with('success', "User {$user->name} has been unbanned from posting reports.");
    }

    /**
     * Ban a user completely (from all platform activity).
     */
    public function banUser(Request $request, User $user)
    {
        $data = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user->update([
            'banned' => true,
            'ban_reason' => $data['reason'],
            'banned_at' => now(),
            'banned_by' => auth()->id(),
        ]);

        return redirect()->route('admin.users')->with('success', "User {$user->name} has been banned from the platform.");
    }

    /**
     * Unban a user completely.
     */
    public function unbanUser(User $user)
    {
        $user->update([
            'banned' => false,
            'ban_reason' => null,
            'banned_at' => null,
            'banned_by' => null,
        ]);

        return redirect()->route('admin.users')->with('success', "User {$user->name} has been unbanned from the platform.");
    }
}

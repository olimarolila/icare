<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
     * Show the form for editing a user.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'nullable|string|max:50',
            'role_description' => 'nullable|string|max:255',
        ]);
        
        $user->update($data);
        
        return redirect()->route('admin.users')->with('success', 'User updated successfully.');
    }

    /**
     * Archive the specified user.
     */
    public function archive(Request $request, User $user)
    {
        $user->update([
            'archived_at' => now(),
            'archived_by' => auth()->id(),
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
            'archived_by' => auth()->id(),
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
}

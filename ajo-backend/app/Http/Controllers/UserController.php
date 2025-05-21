<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\UserAuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('role');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('username', 'like', "%$search%");
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('role', function ($q) use ($request) {
                $q->where('name', $request->input('role'));
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('date')) {
            $now = now();
            $date = $request->input('date');
            if ($date === '7days') {
                $query->where('created_at', '>=', $now->subDays(7));
            } elseif ($date === '30days') {
                $query->where('created_at', '>=', $now->subDays(30));
            } elseif ($date === '90days') {
                $query->where('created_at', '>=', $now->subDays(90));
            }
        }

        $sortField = $request->input('sort', 'created_at');
        $sortOrder = $request->input('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with('role')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json(['user' => $user], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6',
            'role_id' => ['required', Rule::exists('roles', 'id')],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'status' => $request->status,
        ]);

        // Log: create
        UserAuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'create',
            'details' => [
                'description' => 'User created by admin'
            ],
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'User berhasil ditambahkan',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => [
                    'id' => $user->role->id,
                    'name' => $user->role->name
                ],
                'status' => $user->status,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'username' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role_id' => ['sometimes', 'required', Rule::exists('roles', 'id')],
            'status' => ['sometimes', 'required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        // ✅ Simpan data lama sebelum update dilakukan
        $oldUserData = $user->toArray();

        // ✅ Hanya update dengan data yang dikirimkan
        $user->fill($request->all());
        $updatedFields = [];

        foreach ($request->all() as $key => $value) {
            if (array_key_exists($key, $oldUserData) && $oldUserData[$key] != $value) {
                $updatedFields[$key] = [
                    'old' => $oldUserData[$key],
                    'new' => $value
                ];
            }
        }

        // ✅ Hanya lakukan update dan logging jika ada perubahan
        if (!empty($updatedFields)) {
            $user->save(); // Simpan perubahan ke database

            UserAuditLog::create([
                'user_id' => $user->id,
                'action_type' => 'update',
                'details' => [
                    'description' => 'User updated by admin',
                    'updated_fields' => $updatedFields,
                ],
                'timestamp' => now(),
            ]);
        }

        return response()->json(['message' => 'User berhasil diperbarui', 'user' => $user], 200);
    }

    public function destroy(User $user)
    {
        if ($user->role_id === 1) {
            return response()->json(['message' => 'Admin utama tidak bisa dihapus'], 403);
        }

        // Log: delete
        UserAuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'delete',
            'details' => [
                'description' => 'User deleted by admin'
            ],
            'timestamp' => now(),
        ]);

        $user->forceDelete();

        return response()->json(['message' => 'User berhasil dihapus'], 200);
    }

    public function toggleStatus(User $user, Request $request)
    {
        $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user->update(['status' => $request->status]);

        // Log: status_change
        UserAuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'status_change',
            'details' => [
                'description' => 'Status changed to ' . $request->status
            ],
            'timestamp' => now(),
        ]);

        return response()->json(['message' => 'Status user berhasil diperbarui', 'user' => $user], 200);
    }
}

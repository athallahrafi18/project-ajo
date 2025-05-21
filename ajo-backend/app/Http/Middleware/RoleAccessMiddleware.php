<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleAccessMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ambil role_id user dan cocokkan dengan daftar role_id yang diizinkan
        // Misalnya admin = 1, manager = 2, cashier = 3, dll
        // Kamu bisa ubah ini sesuai role_id di sistemmu

        $roleMap = [
            'admin' => 1,
            'cashier' => 2,
            'manager' => 3,
            'owner' => 4,
        ];

        $allowedRoleIds = collect($roles)
            ->map(fn($role) => $roleMap[strtolower($role)] ?? null)
            ->filter()
            ->toArray();

        if (!in_array($user->role_id, $allowedRoleIds)) {
            return response()->json(['message' => 'Akses ditolak. Anda tidak memiliki izin.'], 403);
        }

        return $next($request);
    }
}

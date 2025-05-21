<?php

namespace App\Http\Controllers;

use App\Models\UserAuditLog;
use Illuminate\Http\Request;

class UserAuditLogController extends Controller
{
    /**
     * Menampilkan daftar audit log untuk user tertentu.
     */
    public function index($id)
    {
        $logs = UserAuditLog::where('user_id', $id)
            ->latest('timestamp')
            ->take(10) // kamu bisa ubah limit kalau perlu
            ->get();

        return response()->json($logs);
    }
}

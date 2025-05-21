<?php

use GuzzleHttp\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserAuditLogController;

// Route::middleware ( [ 'auth:sanctum' ] )->get ( '/user', function (Request $request)
// {
//     return $request->user ();
// } );

// Route tanpa autentikasi
Route::get ( '/menus', [ MenuController::class, 'index' ] );
Route::get ( '/menus/{id}', [ MenuController::class, 'show' ] );

// Auth Route
Route::prefix ( 'auth' )->group ( function ()
{
    Route::post ( '/login', [ AuthController::class, 'login' ] );
    Route::post ( '/logout', [ AuthController::class, 'logout' ] )->middleware ( 'auth:sanctum' );
    Route::get ( '/me', [ AuthController::class, 'me' ] )->middleware ( 'auth:sanctum' );
} );

Route::middleware(['auth:sanctum', 'role_access:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']); // Lihat semua user
    Route::get('/users/{id}', [UserController::class, 'show']); //Lihat user by ID
    Route::post('/users', [UserController::class, 'store']); // Tambah user
    Route::put('/users/{user}', [UserController::class, 'update']); // Edit user
    Route::delete('/users/{user}', [UserController::class, 'destroy']); // Hapus user
    Route::patch('/users/{user}/status', [UserController::class, 'toggleStatus']); // Ubah status user

    //User Audit Logs
    Route::get('/users/{id}/audit-logs', [UserAuditLogController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role_access:admin, manager'])->group(function () {
    Route::post('/menus', [MenuController::class, 'store']);            // Tambah menu
    Route::put('/menus/{menu}', [MenuController::class, 'update']);     // Edit menu
    Route::patch('/menus/{menu}/status', [MenuController::class, 'updateStatus']); // Ubah status menu
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']); // Hapus menu
});

Route::middleware(['auth:sanctum', 'role_access:admin, manager'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']); // Lihat semua kategori
    Route::get('/categories/{category}', [CategoryController::class, 'show']); //Lihat kategori by ID
    Route::post('/categories', [CategoryController::class, 'store']); // Tambah kategori
    Route::put('/categories/{category}', [CategoryController::class, 'update']); // Edit kategori
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']); // Hapus kategori
});
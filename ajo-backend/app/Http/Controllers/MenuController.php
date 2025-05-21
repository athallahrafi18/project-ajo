<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Menampilkan semua menu
     */
    public function index()
    {
        $menus = Menu::with(['category.parent'])->get();

        $formatted = $menus->map(function ($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => $menu->price,
                'status' => $menu->status,
                'image' => $menu->image,
                'category' => [
                    'id' => $menu->category?->id,
                    'name' => $menu->category?->name,
                    'parent' => $menu->category?->parent ? [
                        'id' => $menu->category->parent->id,
                        'name' => $menu->category->parent->name,
                    ] : null
                ],
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Menampilkan detail satu menu
     */
    public function show(Menu $menu)
    {
        $menu->load('category');

        return response()->json([
            'id' => $menu->id,
            'name' => $menu->name,
            'description' => $menu->description,
            'price' => $menu->price,
            'status' => $menu->status,
            'image' => $menu->image,
            'category' => $menu->category?->name ?? 'Unknown',
        ]);
    }

    /**
     * Menambahkan menu baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:In Stock,Out of Stock',
            'image' => 'nullable|string',
        ]);

        $menu = Menu::create($validated);
        $menu->load('category');

        return response()->json([
            'message' => 'Menu berhasil ditambahkan',
            'data' => array_merge(
                $menu->toArray(),
                ['category' => $menu->category?->name ?? 'Unknown']
            ),
        ], 201);
    }

    /**
     * Mengupdate data menu (semua field)
     */
    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'status' => 'sometimes|required|in:In Stock,Out of Stock',
            'image' => 'nullable|string',
        ]);

        $menu->update($validated);
        $menu->load('category');

        return response()->json([
            'message' => 'Menu berhasil diperbarui',
            'data' => array_merge(
                $menu->toArray(),
                ['category' => $menu->category?->name ?? 'Unknown']
            ),
        ]);
    }

    /**
     * Mengubah status menu
     */
    public function updateStatus(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'status' => 'required|in:In Stock,Out of Stock',
        ]);

        $menu->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status menu berhasil diperbarui',
            'data' => $menu,
        ]);
    }

    /**
     * Menghapus menu
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json([
            'message' => 'Menu berhasil dihapus',
        ], 204);
    }
}

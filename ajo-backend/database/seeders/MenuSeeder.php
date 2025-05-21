<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Menu;
use App\Models\Category;
use PhpOffice\PhpSpreadsheet\IOFactory;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus semua data lama
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Menu::truncate();
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Ambil file Excel
        $path = storage_path('app/menus/MENU OOMI LEZATO.xlsx');
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Baris ke-3 (index 2): nama tenant/kategori utama
        $categoryNames = $rows[2];

        // Simpan sub-kategori aktif per kolom
        $currentSubCategory = [];

        for ($i = 3; $i < count($rows); $i++) {
            $row = $rows[$i];

            for ($j = 1; $j < count($row); $j++) {
                $cell = isset($row[$j]) ? trim($row[$j]) : null;

                if (empty($cell)) continue;

                // Ambil dan TRIM nama kategori utama
                $mainCategoryName = isset($categoryNames[$j]) ? trim($categoryNames[$j]) : 'Uncategorized';

                $mainCategory = Category::firstOrCreate([
                    'name' => $mainCategoryName,
                    'parent_id' => null
                ]);

                // Deteksi jika cell adalah sub-kategori (pakai tanda ":")
                if (str_ends_with($cell, ':')) {
                    $subName = rtrim(trim($cell), ':');

                    // Buat subkategori di bawah kategori utama
                    $currentSubCategory[$j] = Category::firstOrCreate([
                        'name' => $subName,
                        'parent_id' => $mainCategory->id
                    ]);
                    continue;
                }

                // Gunakan sub-kategori jika ada
                $usedCategory = $currentSubCategory[$j] ?? $mainCategory;

                // Handle format: "NAMA HOT (10K) ICE (12K)"
                if (preg_match_all('/(HOT|ICE)\s*\((\d+)[kK]\)/', $cell, $matches, PREG_SET_ORDER)) {
                    foreach ($matches as $match) {
                        $variant = strtoupper(trim($match[1])); // HOT / ICE
                        $price = (int)$match[2] * 1000;

                        // Hilangkan semua (XXX) agar tidak dobel
                        $baseName = trim(preg_replace('/\s*\(.*?\)/', '', $cell));
                        $baseName = preg_replace('/\s*HOT.*$/i', '', $baseName); // buang trailing

                        Menu::create([
                            'name' => trim($baseName . ' ' . $variant),
                            'description' => '',
                            'category_id' => $usedCategory->id,
                            'price' => $price,
                            'status' => 'In Stock',
                            'image' => null,
                        ]);
                    }
                }
                // Jika hanya 1 varian seperti: "KOPI SUSU TELUR HOT (15K)"
                elseif (preg_match('/^(.*)\((\d+)[kK]\)$/', $cell, $match)) {
                    $name = trim($match[1]);
                    $price = (int)$match[2] * 1000;

                    Menu::create([
                        'name' => $name,
                        'description' => '',
                        'category_id' => $usedCategory->id,
                        'price' => $price,
                        'status' => 'In Stock',
                        'image' => null,
                    ]);
                }
                // Jika tidak ada harga, default ke 0
                else {
                    Menu::create([
                        'name' => $cell,
                        'description' => '',
                        'category_id' => $usedCategory->id,
                        'price' => 0,
                        'status' => 'In Stock',
                        'image' => null,
                    ]);
                }
            }
        }
    }
}

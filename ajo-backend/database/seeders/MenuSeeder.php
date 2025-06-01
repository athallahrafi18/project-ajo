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

        // 1. Kumpulkan nama-nama menu BEST SELLER (kolom 12/index 12)
        $bestSellerNames = [];
        for ($i = 3; $i < count($rows); $i++) {
            $cell = isset($rows[$i][12]) ? trim($rows[$i][12]) : null;
            if (!empty($cell)) {
                $cleanName = trim(preg_replace('/\s*\(.*?\)/', '', $cell));
                $bestSellerNames[] = $cleanName;
                $bestSellerNames[] = $cell; // Simpan juga original (ada varian/harga)
            }
        }
        $bestSellerNames = array_filter(array_unique($bestSellerNames));

        // Simpan sub-kategori aktif per kolom
        $currentSubCategory = [];

        // 2. Proses menu dari semua tenant/kategori, kolom 1–11 saja!
        for ($i = 3; $i < count($rows); $i++) {
            $row = $rows[$i];

            for ($j = 1; $j < 12; $j++) { // <--- Hanya sampai kolom 11 (index 11)!
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

                // Bersihkan nama untuk best seller check
                $cleanMenuName = trim(preg_replace('/\s*\(.*?\)/', '', $cell));

                // Handle format: "NAMA HOT (10K) ICE (12K)"
                if (preg_match_all('/(HOT|ICE)\s*\((\d+)[kK]\)/', $cell, $matches, PREG_SET_ORDER)) {
                    foreach ($matches as $match) {
                        $variant = strtoupper(trim($match[1])); // HOT / ICE
                        $price = (int)$match[2] * 1000;

                        // Hilangkan semua (XXX) agar tidak dobel
                        $baseName = trim(preg_replace('/\s*\(.*?\)/', '', $cell));
                        $baseName = preg_replace('/\s*HOT.*$/i', '', $baseName); // buang trailing
                        $fullMenuName = trim($baseName . ' ' . $variant);

                        // Cek ke best seller
                        $isBestSeller = in_array($fullMenuName, $bestSellerNames) || in_array($baseName, $bestSellerNames) || in_array($cleanMenuName, $bestSellerNames);

                        Menu::create([
                            'name' => $fullMenuName,
                            'description' => '',
                            'category_id' => $usedCategory->id,
                            'price' => $price,
                            'status' => 'In Stock',
                            'image' => null,
                            'is_best_seller' => $isBestSeller,
                        ]);
                    }
                }
                // Jika hanya 1 varian seperti: "KOPI SUSU TELUR HOT (15K)"
                elseif (preg_match('/^(.*)\((\d+)[kK]\)$/', $cell, $match)) {
                    $name = trim($match[1]);
                    $price = (int)$match[2] * 1000;
                    $isBestSeller = in_array($name, $bestSellerNames) || in_array($cleanMenuName, $bestSellerNames);

                    Menu::create([
                        'name' => $name,
                        'description' => '',
                        'category_id' => $usedCategory->id,
                        'price' => $price,
                        'status' => 'In Stock',
                        'image' => null,
                        'is_best_seller' => $isBestSeller,
                    ]);
                }
                // Jika tidak ada harga, default ke 0
                else {
                    $isBestSeller = in_array($cell, $bestSellerNames) || in_array($cleanMenuName, $bestSellerNames);

                    Menu::create([
                        'name' => $cell,
                        'description' => '',
                        'category_id' => $usedCategory->id,
                        'price' => 0,
                        'status' => 'In Stock',
                        'image' => null,
                        'is_best_seller' => $isBestSeller,
                    ]);
                }
            }
        }
    }
}

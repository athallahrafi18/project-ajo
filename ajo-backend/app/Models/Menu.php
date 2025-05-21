<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'category_id', 'price', 'status', 'image'];

    protected $casts = [
        'price' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

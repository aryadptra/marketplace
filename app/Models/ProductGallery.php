<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductGallery extends Model
{
    use HasFactory;

    // Fillable
    protected $fillable = [
        'product_id',
        'image'
    ];

    // Relationship
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}

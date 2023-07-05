<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductGallery;
use Illuminate\Http\Request;

class ProductGalleryController extends Controller
{
    /**
     * Upload image gallery
     * id = product id
     */
    public function upload($id)
    {
        // Upload image
        $image = request()->file('photo')->store(
            'assets/products/gallery',
            'public'
        );

        // Save to database (product_galleries table)
        ProductGallery::create([
            'product_id' => $id,
            'image' => $image
        ]);

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Image uploaded',
            'data' => [
                'photo' => $image
            ]
        ]);
    }
}

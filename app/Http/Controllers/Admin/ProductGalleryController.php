<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    /** 
     * Delete image gallery
     * 
     */
    public function delete($id)
    {
        // Find the gallery item by ID
        $galleryItem = ProductGallery::find($id);

        // Check if the gallery item exists
        if (!$galleryItem) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found',
            ], 404);
        }

        // Delete the image from storage
        Storage::disk('public')->delete($galleryItem->image);

        // Delete the gallery item from the database
        $galleryItem->delete();

        return redirect()->back();
    }
}

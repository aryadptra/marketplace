<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductGalleryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('product/{slug}', [App\Http\Controllers\ProductController::class, 'show'])->name('product.detail');

Route::get('/prototype/login', function () {
    return view('pages.app.login');
})->name('prototype.login');

Auth::routes();

Route::get('category/search', [CategoryController::class, 'search'])->name('category.search');

Route::prefix('cart')
    ->middleware(['auth'])
    ->group(function () {
        Route::get('/', [App\Http\Controllers\CartController::class, 'index'])->name('cart');
        Route::post('/{id}', [App\Http\Controllers\CartController::class, 'add'])->name('cart-add');
        Route::delete('/{id}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart-remove');
    });

Route::get('/checkout', [App\Http\Controllers\CartController::class, 'checkout'])->name('checkout');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        // Route Resource Category
        Route::resource('category', CategoryController::class);
        Route::resource('product', ProductController::class);

        Route::post('/product/{id}/gallery/upload', [ProductGalleryController::class, 'upload'])->name('product.gallery.upload');

        Route::resource('order', OrderController::class);
    });

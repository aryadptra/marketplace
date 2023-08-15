<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductGalleryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController as ControllersOrderController;
use App\Http\Controllers\UserController;
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
        Route::put('/{id}', [App\Http\Controllers\CartController::class, 'update'])->name('cart-update');
        Route::delete('/{id}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart-remove');
    });

// Route::get('/checkout', [App\Http\Controllers\CartController::class, 'checkout'])->name('checkout');
Route::get('/checkout', [App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout');
Route::post('/handleCheckout', [App\Http\Controllers\CheckoutController::class, 'handleCheckout'])->name('handleCheckout');
Route::post('/handleNotification', [App\Http\Controllers\CheckoutController::class, 'handleNotification'])->name('handleNotification');

Route::resource('order', ControllersOrderController::class);
Route::get('/order/success', [ControllersOrderController::class, 'success'])->name('order.success');
Route::get('/invoice/{id}', [ControllersOrderController::class, 'invoice'])->name('order.invoice');
Route::post('/order/{id}/cancel', [ControllersOrderController::class, 'cancel'])->name('order.cancel');
Route::post('/order/notification', [ControllersOrderController::class, 'notification'])->name('order.notification');


// User Profile
Route::prefix('profile')
    ->middleware(['auth'])
    ->group(function () {
        Route::get('/', [App\Http\Controllers\UserController::class, 'index'])->name('profile');
        Route::post('/update', [App\Http\Controllers\UserController::class, 'update'])->name('profile-update');
        Route::post('/update-password', [App\Http\Controllers\UserController::class, 'updatePassword'])->name('profile-update-password');
    });

Route::prefix('ongkir')
    ->name('ongkir.')
    ->group(function () {
        Route::get('/province', [App\Http\Controllers\OngkirController::class, 'province'])->name('province');
        Route::get('/city/{id}', [App\Http\Controllers\OngkirController::class, 'city'])->name('city');
        Route::post('/cost', [App\Http\Controllers\OngkirController::class, 'cost'])->name('cost');
    });

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

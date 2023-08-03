<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use RealRashid\SweetAlert\Facades\Alert;

class CartController extends Controller
{
    public function index()
    {

        // Delete alert
        $title = 'Delete User!';
        $text = "Are you sure you want to delete?";
        confirmDelete($title, $text);

        $cart = Cart::with(['product', 'user'])->where('user_id', Auth::user()->id)->get();
        return view('pages.app.cart', [
            'cart' => $cart
        ]);
    }

    public function add(Request $request, $id)
    {
        Cart::create([
            'user_id' => Auth::user()->id,
            'product_id' => $id,
            'quantity' => $request->quantity
        ]);
        return redirect()->route('cart');
    }

    public function remove($id)
    {
        if($request->isMethod('get'))
        {
            $item = Cart::findOrFail($id);
            $item->delete();
            Alert::success('Success', 'Product berhasil dihapus!');
        }
        return redirect()->route('cart');
    }

    public function checkout()
    {
        $cart = Cart::with(['product', 'user'])->where('user_id', Auth::user()->id)->get();
        return view('pages.app.checkout', [
            'cart' => $cart
        ]);
    }
}
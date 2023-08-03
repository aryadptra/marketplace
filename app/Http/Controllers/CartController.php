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
        $title = 'Delete Cart!';
        $text = "Are you sure you want to delete?";
        confirmDelete($title, $text);

        $cart = Cart::with(['product', 'user'])->where('user_id', Auth::user()->id)->get();
        return view('pages.app.cart', [
            'cart' => $cart
        ]);
    }

    public function add(Request $request, $id)
    {
        // Pengecekan apakah ada id yang dikirim
        // Jika ada id yang sama, maka update quantity dari cart
        // Jika tidak ada id yang sama, maka tambahkan cart baru
        $cart = Cart::where('user_id', Auth::user()->id)->where('product_id', $id)->first();

        if($cart){
            $cart->quantity = $cart->quantity + $request->quantity;
            $cart->save();
            Alert::success('Success', 'Berhasil menambahkan kuantitas!');
        }
        else{
            $cart = new Cart();
            $cart->user_id = Auth::user()->id;
            $cart->product_id = $id;
            $cart->quantity = $request->quantity;
            $cart->save();
            Alert::success('Success', 'Product berhasil ditambahkan!');
        }

        return redirect()->route('cart');
    }

    public function remove($id)
    {
        $item = Cart::findOrFail($id);
        $item->delete();
        Alert::success('Success', 'Product berhasil dihapus!');
        
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
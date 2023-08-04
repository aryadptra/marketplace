<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Config as ConfigMidtrans;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Set konfigurasi Midtrans
        ConfigMidtrans::$serverKey = env('MIDTRANS_SERVER_KEY');
        ConfigMidtrans::$clientKey = env('MIDTRANS_CLIENT_KEY');
        ConfigMidtrans::$isProduction = env('MIDTRANS_IS_PRODUCTION');

        $user_id = Auth::user()->id;
        $cart = Cart::with(['product', 'user'])->where('user_id', $user_id)->get();

        $total = 0;
        foreach ($cart as $c) {
            $total += $c->product->price * $c->quantity;
        }


        /**
         * Array Untuk Request Payment Midtrans
         */

        // Optional
        $item = [];
        foreach ($cart as $c) {
            $item[] = [
                'id' => $c->product->id,
                'price' => $c->product->price,
                'quantity' => $c->quantity,
                'name' => $c->product->name
            ];
        }
        $item_details = $item;

        // Ambil nama lengkap dari user
        $fullName = Auth::user()->name;

        // Pemisahan first name dan last name
        $names = explode(' ', $fullName);
        $firstName = $names[0]; // Ambil bagian pertama sebagai first name

        // Cek apakah ada last name atau tidak
        if (count($names) > 1) {
            $lastName = implode(' ', array_slice($names, 1)); // Gabungkan sisa bagian sebagai last name
        } else {
            $lastName = "";
        }

        $user = User::find(Auth::user()->id);

        // Optional
        $shipping_address = array(
            'first_name'    => $firstName,
            'last_name'     => $lastName,
            'address'       => $request->address,
            'city'          => "Jakarta",
            'postal_code'   => $user->detail->postal_code,
            'phone'         => $user->detail->phone_number,
            'country_code'  => 'IDN'
        );

        // Optional
        $customer_details = [
            'first_name'    => $firstName,
            'last_name'     => $lastName,
            'email'         => Auth::user()->email,
            'phone'         => $user->detail->phone_number,
            'billing_address'  => $shipping_address,
            'shipping_address' => $shipping_address
        ];

        // Optional
        $enable_payments = array('gopay', 'bank_transfer');

        $params = array(
            'enabled_payments' => $enable_payments,
            'transaction_details' => array(
                'order_id' => rand(),
                'gross_amount' => $total,
            ),
            'customer_details' => $customer_details,
            'item_details' => $item_details,
        );

        $snapToken = \Midtrans\Snap::getSnapToken($params);

        /**
         * Array Untuk Insert Ke Table Orders
         */
        $order_data = [
            'user_id' => $user_id,
            'invoice_number' =>  date('Ymd') . $user_id . rand(1, 9999),
            'shipping_address' => $request->address,
            'payment_method' => "Online Payment",
            'payment_detail' => "Online Payment",
            'payment_status' => 'Pending',
            'courier' => "Courier",
            'shipping_code' => "Shipping Code",
            'snap_token' => $snapToken
        ];

        $order = Order::create($order_data);

        /**
         * Array Untuk Insert Ke Table Order Details
         */
        foreach ($cart as $c) {
            $order_detail_data[] = [
                'order_id' => $order->id,
                'product_id' => $c->product->id,
                'quantity' => $c->quantity,
                'price' => $c->product->price,
                'tax' => 0,
                'shipping_cost' => 0,
                'grand_total' => $c->product->price * $c->quantity
            ];
        }

        $order->order_detail()->createMany($order_detail_data);

        /**
         * Kuranngi Stok Produk
         */
        foreach ($cart as $c) {
            $product = Product::find($c->product->id);
            $product->update([
                'stock' => $product->stock - $c->quantity
            ]);
        }

        /**
         * Array Untuk Hapus Cart
         */
        $cart_id = [];
        foreach ($cart as $c) {
            $cart_id[] = $c->id;
        }

        Cart::whereIn('id', $cart_id)->delete();

        /**
         * Redirect ke halaman cart
         */
        return redirect()->route('cart.index')->with('success', 'Order Success! Please Complete Your Payment');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
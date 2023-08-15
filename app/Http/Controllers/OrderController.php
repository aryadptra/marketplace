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

        $invoice_number = date('Ymd') . $user_id . rand(100, 999);

        $total = 0;

        foreach ($cart as $c) {
            $total += $c->product->price * $c->quantity;
        }

        $total += $request->total_ongkir; // Tambahkan ongkos kirim ke total
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

        $item[] = [
            'id' => 'shipping',
            'price' => $request->total_ongkir,
            'quantity' => 1,
            'name' => 'Biaya Pengiriman'
        ];

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
            'city'          => $request->city,
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
            // 'enabled_payments' => $enable_payments,
            'transaction_details' => array(
                'order_id' => $invoice_number,
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
            'invoice_number' =>  $invoice_number,
            'province' => $request->province,
            'city' => $request->city,
            'shipping_address' => $request->address,
            'payment_method' => "-",
            'payment_detail' => "-",
            'payment_status' => 'Pending',
            'courier' => $request->courier,
            'courier_service' => $request->courier_service,
            'shipping_code' => "-",
            'shipping_fee' => $request->total_ongkir,
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
        return redirect()->route('profile')->with('success', 'Order Success! Please Complete Your Payment');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Detail Order
        $order = Order::with(['order_detail', 'user'])->where('id', $id)->first();

        // Order Details
        $order_details = $order->order_detail;

        // Cek apakah user yang mengakses adalah pemilik order
        if (Auth::user()->id != $order->user_id) {
            return redirect()->back();
        }

        return view('pages.app.order-detail', [
            'order' => $order,
        ]);
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

    /**
     * Callback Midtrans
     */
    public function notification(Request $request)
    {
        ConfigMidtrans::$isProduction = env('MIDTRANS_IS_PRODUCTION');
        ConfigMidtrans::$serverKey = env('MIDTRANS_SERVER_KEY');
        ConfigMidtrans::$clientKey = env('MIDTRANS_CLIENT_KEY');


        try {
            $notif = new Notification();
        } catch (\Exception $e) {
            exit($e->getMessage());
        }

        $notif = $notif->getResponse();
        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $order_id = $notif->order_id;
        $fraud = $notif->fraud_status;
        $signature_key = $notif->signature_key;

        // $order where invoice_number = $order_id
        $order = Order::where('invoice_number', $order_id)->first();

        if ($transaction == 'capture') {
            // For credit card transaction, we need to check whether transaction is challenge by FDS or not
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $order->update([
                        'payment_status' => 'Pending'
                    ]);
                } else {
                    $order->update([
                        'payment_status' => 'Success'
                    ]);
                }
            }
        } elseif ($transaction == 'settlement') {
            $order->update([
                'payment_status' => 'Success',
                'payment_method' => $type,
                'payment_detail' => $signature_key
            ]);
        } elseif ($transaction == 'pending') {
            $order->update([
                'payment_status' => 'Pending'
            ]);
        } elseif ($transaction == 'deny') {
            $order->update([
                'payment_status' => 'Failed'
            ]);
        } elseif ($transaction == 'expire') {
            $order->update([
                'payment_status' => 'Expired'
            ]);
        } elseif ($transaction == 'cancel') {
            $order->update([
                'payment_status' => 'Failed'
            ]);
        }
    }

    public function invoice($id)
    {
        $order = Order::with(['order_detail', 'user'])->where('id', $id)->first();
        $order_details = $order->order_detail;
        $clientKey = env('MIDTRANS_CLIENT_KEY');

        // Cek apakah user yang mengakses adalah pemilik order
        if (Auth::user()->id != $order->user_id) {
            return redirect()->back();
        }

        return view('pages.app.invoice', [
            'order' => $order,
            'order_details' => $order_details,
            'clientKey' => $clientKey
        ]);
    }
}

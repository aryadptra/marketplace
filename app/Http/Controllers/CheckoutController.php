<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Config as ConfigMidtrans;
use Midtrans\Snap;
use Midtrans\Notification;

class CheckoutController extends Controller
{
    public function __construct()
    {
        // Set your Merchant Server Key
        ConfigMidtrans::$serverKey = env('MIDTRANS_SERVER_KEY');
        // Set Client Key
        ConfigMidtrans::$clientKey = env('MIDTRANS_CLIENT_KEY');
        // Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
        ConfigMidtrans::$isProduction = env('MIDTRANS_IS_PRODUCTION');
        // Set sanitization on (default)
        ConfigMidtrans::$isSanitized = env('MIDTRANS_IS_SANITIZED');
        // Set 3DS transaction for credit card to true
        ConfigMidtrans::$is3ds = env('MIDTRANS_IS_3DS');

    }

    public function index()
    {
        $clientKey = env('MIDTRANS_CLIENT_KEY');
        return view('checkout',[
            'clientKey' => $clientKey,  
        ]);
    }

    public function handleCheckout(Request $request)
    {
        // Set konfigurasi Midtrans
        ConfigMidtrans::$serverKey = env('MIDTRANS_SERVER_KEY');
        ConfigMidtrans::$clientKey = env('MIDTRANS_CLIENT_KEY');
        ConfigMidtrans::$isProduction = env('MIDTRANS_IS_PRODUCTION');

        $params = array(
            'transaction_details' => array(
                'order_id' => rand(),
                'gross_amount' => 10000,
            )
        );

        $snapToken = \Midtrans\Snap::getSnapToken($params);

        // Beri response snap token
        $this->response['snap_token'] = $snapToken;
        return response()->json($this->response);
    }

    public function handleNotification(Request $request)
    {
        try {
            $notif = new Notification();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $response = $notif->getResponse();
        $transaction = $response->transaction_status;
        $type = $response->payment_type;
        $order_id = $response->order_id;
        $fraud = $response->fraud_status;

        if ($transaction == 'capture') {
            // For credit card transaction, we need to check whether transaction is challenge by FDS or not
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    // TODO set payment status in merchant's database to 'Challenge by FDS'
                    // TODO merchant should decide whether this transaction is authorized or not in MAP
                    return response()->json(['message' => "Transaction order_id: $order_id is challenged by FDS"]);
                } else {
                    // TODO set payment status in merchant's database to 'Success'
                    return response()->json(['message' => "Transaction order_id: $order_id successfully captured using $type"]);
                }
            }
        } else if ($transaction == 'settlement') {
            // TODO set payment status in merchant's database to 'Settlement'
            return response()->json(['message' => "Transaction order_id: $order_id successfully transferred using $type"]);
        } else if ($transaction == 'pending') {
            // TODO set payment status in merchant's database to 'Pending'
            return response()->json(['message' => "Waiting for the customer to finish transaction order_id: $order_id using $type"]);
        } else if ($transaction == 'deny') {
            // TODO set payment status in merchant's database to 'Denied'
            return response()->json(['message' => "Payment using $type for transaction order_id: $order_id is denied"]);
        } else if ($transaction == 'expire') {
            // TODO set payment status in merchant's database to 'expire'
            return response()->json(['message' => "Payment using $type for transaction order_id: $order_id is expired"]);
        } else if ($transaction == 'cancel') {
            // TODO set payment status in merchant's database to 'Denied'
            return response()->json(['message' => "Payment using $type for transaction order_id: $order_id is canceled"]);
        }

        return response()->json(['message' => "Unrecognized transaction status"]);
    }
}
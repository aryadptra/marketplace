@extends('layouts.app')

@section('title', 'Faktur')

@push('custom-style')
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="{{ $clientKey }}"></script>
@endpush

@push('add-content')
    <section class="page-title bg-white">
        <div class="container">
            <div class="page-title-row">
                <div class="page-title-content">
                    <h1>Faktur</h1>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active" aria-current="page">Faktur</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
@endpush

@section('content')
    <section class="bg-white">
        <div class="container">
            <div class="row py-5" style="--bs-gutter-x:6rem;">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="container mb-5 mt-3">
                                <div class="row d-flex align-items-baseline">
                                    <div class="col-xl-9">
                                        <p style="color: #7e8d9f;font-size: 20px;">Invoice<strong> -
                                                {{ $order->invoice_number }}</strong>
                                        </p>
                                    </div>
                                    <hr>
                                </div>
                                <div class="container">
                                    <div class="col-md-12">
                                        <div class="text-center">
                                            <i class="bi-cart-fill fa-4x ms-0"></i>
                                            <p class="pt-0">MakayaStore</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <ul class="list-unstyled">
                                                <li class="text-muted">To: <span>{{ $order->user->name }}</span>
                                                </li>
                                                <li class="text-muted">{{ $order->shipping_address }}</li>
                                                <li class="text-muted">{{ $order->city }}</li>
                                                <li class="text-muted">{{ $order->province }}</li>
                                                <li class="text-muted"><i class="fas fa-phone"></i>
                                                    {{ $order->user->detail->phone_number }}</li>
                                            </ul>
                                        </div>
                                        <div class="col-xl-4">
                                            <p class="text-muted">Invoice</p>
                                            <ul class="list-unstyled">
                                                <li class="text-muted"><i class="fas fa-circle"></i>
                                                    <span class="fw-bold">ID:</span>#123-456
                                                </li>
                                                <li class="text-muted"><i class="fas fa-circle"></i>
                                                    <span class="fw-bold">Creation Date: </span>{{ $order->created_at }}
                                                </li>
                                                <li class="text-muted"><i class="fas fa-circle"></i>
                                                    <span class="me-1 fw-bold">Status:</span><span
                                                        class="badge bg-warning text-black fw-bold">
                                                        Unpaid</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="row my-2 mx-1 justify-content-center">
                                        <table class="table table-striped table-borderless">
                                            <thead class="text-white bg-primary">
                                                <tr>
                                                    <th class=" text-white" scope="col">#</th>
                                                    <th class=" text-white" scope="col">Description</th>
                                                    <th class=" text-white" scope="col">Qty</th>
                                                    <th class=" text-white" scope="col">Harga Satuan</th>
                                                    <th class=" text-white" scope="col">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach ($order_details as $item)
                                                    <tr>
                                                        <th scope="row">{{ $loop->iteration }}</th>
                                                        <td>{{ $item->product->name }}</td>
                                                        <td>{{ $item->quantity }}</td>
                                                        <td>Rp.
                                                            {{ number_format($item->product->price, 0, ',', '.') }}</td>
                                                        <td>Rp.
                                                            {{ number_format($item->quantity * $item->product->price, 0, ',', '.') }}
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <p class="ms-3">{{ $order->notes }}</p>
                                        </div>
                                        <div class="col-xl-3">
                                            <ul class="list-unstyled">
                                                <li class="text-muted ms-3"><span class="text-black me-4">Sub Total</span>
                                                    @php
                                                        $total = 0;
                                                        foreach ($order_details as $item) {
                                                            $total += $item->quantity * $item->product->price;
                                                        }
                                                        echo 'Rp. ' . number_format($total, 0, ',', '.');
                                                    @endphp
                                                </li>
                                                <li class="text-muted ms-3 mt-2"><span
                                                        class="text-black me-4">Pengiriman</span>Rp.
                                                    {{ number_format($order->shipping_fee, 0, ',', '.') }}</li>
                                            </ul>
                                            <p class="text-black float-start"><span class="text-black me-3"> Total
                                                    Amount</span><span style="font-size: 25px;">
                                                    @php
                                                        $total_amount = $total + $order->shipping_fee;
                                                        
                                                        echo 'Rp. ' . number_format($total_amount, 0, ',', '.');
                                                    @endphp
                                                </span></p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xl-10">
                                            <p>Thank you for your purchase</p>
                                        </div>
                                        <div class="col-xl-2">
                                            <button type="button" id="button-pay" class="btn btn-primary text-capitalize"
                                                style="background-color:#60bdf3 ;">Pay Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('custom-script')
    <script type="text/javascript">
        document.getElementById('button-pay').onclick = function() {
            // SnapToken acquired from previous step
            snap.pay('{{ $order->snap_token }}', {
                // Optional
                onSuccess: function(result) {
                    /* You may add your own js here, this is just example */
                    document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
                },
                // Optional
                onPending: function(result) {
                    /* You may add your own js here, this is just example */
                    document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
                },
                // Optional
                onError: function(result) {
                    /* You may add your own js here, this is just example */
                    document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
                }
            });
        };
    </script>
@endpush

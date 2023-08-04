@extends('layouts.app')

@section('title', 'Checkout')

@push('custom-style')
    <script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="{{ $clientKey }}"></script>
@endpush

@push('add-content')
    <section class="page-title bg-white">
        <div class="container">
            <div class="page-title-row">
                <div class="page-title-content">
                    <h1>Checkout</h1>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active" aria-current="page">Checkout</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
@endpush

@section('content')
    <section class="bg-white">
        <div class="container">
            <form action="{{ route('order.store') }}" method="post">
                @csrf
                @method('POST')
                <div class="row col-mb-50 gutter-50">
                    <div class="col-lg-6">
                        <div class="col-lg-12">
                            <h3>Alamat Pengiriman</h3>
                            <form id="shipping-form" name="shipping-form" class="row mb-0" action="#" method="post">
                                <div class="col-md-12 form-group">
                                    <label for="shipping-form-name">Nama:</label>
                                    <input type="text" value="{{ Auth::user()->name }}" id="shipping-form-name"
                                        name="shipping-form-name" value="" class="form-control">
                                </div>
                                <div class="w-100"></div>
                                <div class="col-12 form-group">
                                    <label for="shipping-form-address">Alamat:</label>
                                    <textarea class="form-control" id="shipping-form-message" name="address" rows="6" cols="30">{{ Auth::user()->detail->address }}</textarea>
                                </div>
                                <div class="col-12 form-group">
                                    <label for="shipping-form-message">Catatan <small>*</small></label>
                                    <textarea class="form-control" id="shipping-form-message" name="shipping-form-message" rows="6" cols="30"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="col-lg-12">
                            <h4>Pesanan Anda</h4>
                            <div class="table-responsive">
                                <table class="table cart">
                                    <thead>
                                        <tr>
                                            <th class="cart-product-thumbnail">&nbsp;</th>
                                            <th class="cart-product-name">Produk</th>
                                            <th class="cart-product-quantity">Kuantitas</th>
                                            <th class="cart-product-subtotal">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        @foreach ($cart as $item)
                                            <tr class="cart_item">
                                                <td class="cart-product-thumbnail">
                                                    <a href="#"><img width="64" height="64"
                                                            src="{{ Storage::url($item->product->thumbnail ?? '') }}"
                                                            alt="Pink Printed Dress"></a>
                                                </td>
                                                <td class="cart-product-name">
                                                    <a href="#">{{ $item->product->name }}</a>
                                                </td>
                                                <td class="cart-product-quantity">
                                                    <div class="quantity">
                                                        {{ $item->quantity }}
                                                    </div>
                                                </td>
                                                <td class="cart-product-subtotal">
                                                    <span class="amount">Rp.
                                                        {{ number_format($item->product->price, 0, ',', '.') }}</span>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <h4>Total Keranjang</h4>
                        <div class="table-responsive">
                            <table class="table cart">
                                <tbody>
                                    <tr class="cart_item">
                                        <td class="border-top-0 cart-product-name">
                                            <strong>Subtotal Cart</strong>
                                        </td>
                                        <td class="border-top-0 cart-product-name">
                                            <span class="amount">
                                                @php
                                                    $total = 0;
                                                    foreach ($cart as $item) {
                                                        $total += $item->product->price * $item->quantity;
                                                    }
                                                    echo 'Rp. ' . number_format($total, 0, ',', '.');
                                                @endphp
                                            </span>
                                        </td>
                                    </tr>
                                    <tr class="cart_item">
                                        <td class="cart-product-name">
                                            <strong>Pengiriman</strong>
                                        </td>
                                        <td class="cart-product-name">
                                            <span class="amount">Gratis</span>
                                        </td>
                                    </tr>
                                    <tr class="cart_item">
                                        <td class="cart-product-name">
                                            <strong>Total</strong>
                                        </td>
                                        <td class="cart-product-name">
                                            <span class="amount color lead">
                                                <strong>
                                                    @php
                                                        $total = 0;
                                                        foreach ($cart as $item) {
                                                            $total += $item->product->price * $item->quantity;
                                                        }
                                                        echo 'Rp. ' . number_format($total, 0, ',', '.');
                                                    @endphp
                                                </strong>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="accordion">
                            <div class="accordion-header">
                                <div class="accordion-icon">
                                    <i class="accordion-closed uil uil-minus"></i>
                                    <i class="accordion-open bi-check-lg"></i>
                                </div>
                                <div class="accordion-title">
                                    Pembayaran Otomatis
                                </div>
                            </div>
                            <div class="accordion-content" style="display: none;">
                                Pembayaran otomatis akan dilakukan setelah Anda menekan tombol "Place Order". Anda dapat
                                memilih
                                metode pembayaran yang Anda inginkan sesuai dengan metode pembayaran yang tersedia.
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            {{-- <button id="pay-button" class="button button-3d">Pesan Sekarang</button> --}}
                            <button type="submit" class="button button-3d">Pesan Sekarang</button>
                        </div>
                    </div>
                    <div class="w-100"></div>
            </form>
        </div>
        </div>
    </section>
@endsection

@push('custom-script')
    <script type="text/javascript">
        // For example trigger on button clicked, or any time you need
        var payButton = document.getElementById('pay-button');
        payButton.addEventListener('click', function() {
            // POST to route handleCheckout
            $.ajax({
                url: "{{ route('handleCheckout') }}",
                method: 'POST',
                data: {
                    _token: '{{ csrf_token() }}'
                },
                success: function(data) {
                    token = data;
                    // call snap.pay() when the AJAX call is successful
                    snap.pay(data.snap_token, {
                        // Optional
                        onSuccess: function(result) {
                            /* You may add your own js here, this is just example */
                            document.getElementById('result-json').innerHTML += JSON
                                .stringify(result, null, 2);
                        },
                        // Optional
                        onPending: function(result) {
                            /* You may add your own js here, this is just example */
                            document.getElementById('result-json').innerHTML += JSON
                                .stringify(result, null, 2);
                        },
                        // Optional
                        onError: function(result) {
                            /* You may add your own js here, this is just example */
                            document.getElementById('result-json').innerHTML += JSON
                                .stringify(result, null, 2);
                        }
                    });
                }
            });
        });
    </script>
@endpush

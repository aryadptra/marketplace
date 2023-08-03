@extends('layouts.app')

@section('title', 'Keranjang')

@push('add-content')
    <section class="page-title bg-white">
        <div class="container">
            <div class="page-title-row">
                <div class="page-title-content">
                    <h1>Keranjang</h1>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active" aria-current="page">Keranjang</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
@endpush

@section('content')
    <section class="bg-white">
        <div class="container">
            <div class="row" style="--bs-gutter-x:6rem;">
                <div class="col-xl-8 py-6 border-end">
                    <table class="table cart mb-5">
                        <thead>
                            <tr>
                                <th class="cart-product-remove">&nbsp;</th>
                                <th class="cart-product-thumbnail">&nbsp;</th>
                                <th class="cart-product-name">Produk</th>
                                <th class="cart-product-price">Harga</th>
                                <th class="cart-product-quantity">Kuantitas</th>
                                <th class="cart-product-subtotal">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if ($cart)
                                @foreach ($cart as $item)
                                    <tr class="cart_item">
                                        <td class="cart-product-remove">
                                            <form action="{{ route('cart-remove', $item->id) }}" method="POST">
                                                @csrf
                                                @method('DELETE')
                                                {{-- Button Submit --}}
                                                <button type="submit" style="background: none;border: none" class="remove"
                                                    data-confirm-delete="true" title="Remove this item">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </form>
                                        </td>
                                        <td class="cart-product-thumbnail">
                                            <a href="#"><img width="64" height="64"
                                                    src="{{ Storage::url($item->product->thumbnail ?? '') }}"
                                                    alt="Pink Printed Dress"></a>
                                        </td>
                                        <td class="cart-product-name">
                                            <a
                                                href="{{ route('product.detail', $item->product->slug) }}">{{ $item->product->name }}</a>
                                        </td>
                                        <td class="cart-product-price">
                                            <span class="amount">Rp.
                                                {{ number_format($item->product->price, 0, ',', '.') }}</span>
                                        </td>
                                        <td class="cart-product-quantity">
                                            <div class="quantity">
                                                <input type="button" value="-" class="minus">
                                                <input type="text" onclick="updateQty()" value="{{ $item->quantity }}"
                                                    id="qtyInput" class="qty">
                                                <input type="button" value="+" class="plus">
                                            </div>
                                        </td>
                                        <td class="cart-product-subtotal">
                                            <span class="amount">Rp.
                                                {{ number_format($item->product->price, 0, ',', '.') }}</span>
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr class="cart_item">
                                    <td colspan="6">
                                        <h3>Tidak ada data</h3>
                                    </td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>

                <div class="col-xl-4 py-6">
                    <div class="grid-inner">
                        <div class="row col-mb-30">
                            <div class="col-12">
                                <h4>Total Keranjang</h4>
                                <div class="table-responsive">
                                    <table class="table cart cart-totals">
                                        <tbody>
                                            <tr class="cart_item">
                                                <td class="cart-product-name">
                                                    <h5 class="mb-0">Subtotal Keranjang</h5>
                                                </td>
                                                <td class="cart-product-name text-end">
                                                    <span class="amount">
                                                        @php
                                                            $total = 0;
                                                            foreach ($cart as $item) {
                                                                $total += $item->product->price;
                                                            }
                                                            echo 'Rp. ' . number_format($total, 0, ',', '.');
                                                        @endphp
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr class="cart_item">
                                                <td class="cart-product-name">
                                                    <h5 class="mb-0">Pengiriman</h5>
                                                </td>
                                                <td class="cart-product-name text-end">
                                                    <span class="amount">Gratis</span>
                                                </td>
                                            </tr>
                                            <tr class="cart_item">
                                                <td class="cart-product-name">
                                                    <h5 class="mb-0">Total</h5>
                                                </td>
                                                <td class="cart-product-name text-end">
                                                    <span class="amount color lead fw-medium">Rp.
                                                        {{ number_format($total, 0, ',', '.') }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col-12">
                                <a href="{{ route('checkout') }}"
                                    class="button button-3d button-black d-block text-center m-0">Checkout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </section>
@endsection

@push('custom-script')
    <script>
        // Get data from https://open-api.my.id/api/wilayah/provinces with jquery
        $.ajax({
            url: 'https://open-api.my.id/api/wilayah/provinces',
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                console.log(result);
            }
        });
    </script>

    {{-- Update qty --}}
    <script>
        function updateQty() {
            var qty = document.getElementById('qtyInput').value;
            document.getElementById('qtyHidden').value = qty;
        }
    </script>
@endpush

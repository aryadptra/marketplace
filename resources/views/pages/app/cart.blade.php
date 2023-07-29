@extends('layouts.app')

@section('title', 'Cart')

@push('add-content')
    <section class="page-title bg-white">
        <div class="container">
            <div class="page-title-row">
                <div class="page-title-content">
                    <h1>Cart</h1>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active" aria-current="page">Cart</li>
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
                                <th class="cart-product-name">Product</th>
                                <th class="cart-product-price">Unit Price</th>
                                <th class="cart-product-quantity">Quantity</th>
                                <th class="cart-product-subtotal">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($cart as $item)
                                <tr class="cart_item">
                                    <td class="cart-product-remove">
                                        <a href="{{ route('cart-remove', $item->id) }}" class="remove"
                                            data-confirm-delete="true" title="Remove this item">
                                            <i class="fa-solid fa-trash"></i>
                                        </a>
                                    </td>
                                    <td class="cart-product-thumbnail">
                                        <a href="#"><img width="64" height="64"
                                                src="{{ Storage::url($item->product->thumbnail ?? '') }}"
                                                alt="Pink Printed Dress"></a>
                                    </td>
                                    <td class="cart-product-name">
                                        <a href="#">{{ $item->product->name }}</a>
                                    </td>
                                    <td class="cart-product-price">
                                        <span class="amount">Rp.
                                            {{ number_format($item->product->price, 0, ',', '.') }}</span>
                                    </td>
                                    <td class="cart-product-quantity">
                                        <div class="quantity">
                                            <input type="button" value="-" class="minus">
                                            <input type="text" name="quantity" value="{{ $item->quantity }}"
                                                class="qty">
                                            <input type="button" value="+" class="plus">
                                        </div>
                                    </td>
                                    <td class="cart-product-subtotal">
                                        <span class="amount">Rp.
                                            {{ number_format($item->product->price, 0, ',', '.') }}</span>
                                    </td>
                                </tr>
                            @endforeach
                            <tr class="cart_item">
                                <td colspan="6">
                                    <div class="row justify-content-between align-items-center py-2 col-mb-30">
                                        <div class="col-lg-auto ps-lg-0">
                                            <div class="row align-items-center">
                                                <div class="col-md-8">
                                                    <input type="text" value=""
                                                        class="form-control text-center text-md-start"
                                                        placeholder="Enter Coupon Code..">
                                                </div>
                                                <div class="col-md-4 mt-3 mt-md-0">
                                                    <a href="#" class="button button-small button-3d button-black m-0"
                                                        style="--cnvs-btn-padding-y:7px;line-height:22px;">Apply
                                                        Coupon</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-auto pe-lg-0">
                                            <a href="#" class="button button-small button-3d m-0">Update Cart</a>
                                        </div>
                                </td>
                            </tr>
                            <tr class="cart_item">
                                <td colspan="6">
                                    <div class="row justify-content-between align-items-center py-2 col-mb-30">
                                        <div class="col-lg-auto ps-lg-0">
                                            <div class="row align-items-center">
                                                <div class="col-12">
                                                    <h3>Cek Ongkir</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-auto pe-lg-0">
                                            <a href="#" class="button button-small button-3d m-0">Update Cart</a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="col-xl-4 py-6">
                    <div class="grid-inner">
                        <div class="row col-mb-30">
                            <div class="col-12">
                                <h4>Cart Totals</h4>
                                <div class="table-responsive">
                                    <table class="table cart cart-totals">
                                        <tbody>
                                            <tr class="cart_item">
                                                <td class="cart-product-name">
                                                    <h5 class="mb-0">Cart Subtotal</h5>
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
                                                    <h5 class="mb-0">Shipping</h5>
                                                </td>
                                                <td class="cart-product-name text-end">
                                                    <span class="amount">Free</span>
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
                                    class="button button-3d button-black d-block text-center m-0">Proceed to
                                    Checkout</a>
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
@endpush

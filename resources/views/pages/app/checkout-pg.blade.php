@extends('layouts.app')

@section('title', 'Checkout')

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
            <div class="row col-mb-50 gutter-50">
                <div class="col-lg-6">
                    <div class="col-lg-12">
                        <h3>Shipping Address</h3>
                        <form id="shipping-form" name="shipping-form" class="row mb-0" action="#" method="post">
                            <div class="col-md-12 form-group">
                                <label for="shipping-form-name">Name:</label>
                                <input type="text" value="{{ Auth::user()->name }}" id="shipping-form-name"
                                    name="shipping-form-name" value="" class="form-control">
                            </div>
                            <div class="w-100"></div>
                            <div class="col-12 form-group">
                                <label for="shipping-form-address">Address:</label>
                                <textarea class="form-control" id="shipping-form-message" name="address" rows="6" cols="30">{{ Auth::user()->detail->address }}</textarea>
                            </div>
                            <div class="col-12 form-group">
                                <label for="shipping-form-message">Notes <small>*</small></label>
                                <textarea class="form-control" id="shipping-form-message" name="shipping-form-message" rows="6" cols="30"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="col-lg-12">
                        <h4>Your Orders</h4>
                        <div class="table-responsive">
                            <table class="table cart">
                                <thead>
                                    <tr>
                                        <th class="cart-product-thumbnail">&nbsp;</th>
                                        <th class="cart-product-name">Product</th>
                                        <th class="cart-product-quantity">Quantity</th>
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
                    <h4>Cart Totals</h4>
                    <div class="table-responsive">
                        <table class="table cart">
                            <tbody>
                                <tr class="cart_item">
                                    <td class="border-top-0 cart-product-name">
                                        <strong>Cart Subtotal</strong>
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
                                        <strong>Shipping</strong>
                                    </td>
                                    <td class="cart-product-name">
                                        <span class="amount">Free Delivery</span>
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
                                Direct Bank Transfer
                            </div>
                        </div>
                        <div class="accordion-content" style="display: none;">Donec sed odio dui. Nulla vitae elit libero,
                            a
                            pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Integer posuere erat a
                            ante
                            venenatis dapibus posuere velit aliquet.</div>
                        <div class="accordion-header">
                            <div class="accordion-icon">
                                <i class="accordion-closed uil uil-minus"></i>
                                <i class="accordion-open bi-check-lg"></i>
                            </div>
                            <div class="accordion-title">
                                Cheque Payment
                            </div>
                        </div>
                        <div class="accordion-content" style="display: none;">Integer posuere erat a ante venenatis
                            dapibus
                            posuere velit aliquet. Duis mollis, est non commodo luctus. Aenean lacinia bibendum nulla sed
                            consectetur. Cras mattis consectetur purus sit amet fermentum.</div>
                        <div class="accordion-header accordion-active">
                            <div class="accordion-icon">
                                <i class="accordion-closed uil uil-minus"></i>
                                <i class="accordion-open bi-check-lg"></i>
                            </div>
                            <div class="accordion-title">
                                Paypal
                            </div>
                        </div>
                        <div class="accordion-content" style="display: block;">Nullam id dolor id nibh ultricies vehicula
                            ut
                            id elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Duis mollis, est
                            non
                            commodo luctus. Aenean lacinia bibendum nulla sed consectetur.</div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <a href="#" class="button button-3d">Place Order</a>
                    </div>
                </div>
                <div class="w-100"></div>
            </div>
        </div>
    </section>
@endsection

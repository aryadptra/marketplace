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
                                {{-- select province --}}
                                <div class="form-group">
                                    <label for="">Provinsi</label>
                                    <select name="province_origin" class="form-control" id="province_origin">
                                        <option value="">-- Pilih Provinsi --</option>
                                    </select>
                                    <input type="text" class="form-control" name="province" id="province">
                                </div>
                                {{-- select city --}}
                                <div class="form-group">
                                    <label for="">Kota</label>
                                    <select name="city_origin" class="form-control" id="city_origin">
                                    </select>
                                    <input type="text" name="city" class="form-control" id="city">
                                </div>
                                <div class="col-12 form-group">
                                    <label for="shipping-form-address">Alamat:</label>
                                    <textarea class="form-control" id="shipping-form-message" name="address" rows="6" cols="30">{{ optional(Auth::user()->detail)->address }}</textarea>
                                </div>
                                <div class="col-12 form-group">
                                    <label for="shipping-form-message">Catatan <small>*</small></label>
                                    <textarea class="form-control" id="notes" name="notes" rows="6" cols="30"></textarea>
                                </div>
                            </form>

                            {{-- select courier --}}
                            <div class="form-group">
                                <label for="">Pilih Kurir</label>
                                <select name="courier" class="form-control" id="courier">
                                    <option value="">-- Pilih Kurir --</option>
                                    <option value="jne">JNE</option>
                                    <option value="pos">POS Indonesia</option>
                                    <option value="tiki">TIKI</option>
                                </select>
                            </div>
                            {{-- select cost --}}
                            <div class="form-group">
                                <label for="">Pilih Layanan</label>
                                <select name="cost" class="form-control" id="cost"></select>
                                <input type="text" name="courier_service" id="courier_service">
                            </div>
                            <div class="form-group">
                                <label>Total Ongkos Kirim</label>
                                <input type="text" class="form-control" id="total-ongkir" readonly>
                                <input type="text" name="total_ongkir" id="total_ongkir" readonly hidden>
                            </div>
                        </div>

                    </div>
                    <div class="col-lg-6">
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
                                            <span class="amount" id="total-pengiriman">-</span>
                                        </td>
                                    </tr>
                                    <tr class="cart_item">
                                        <td class="cart-product-name">
                                            <strong>Total</strong>
                                        </td>
                                        <td class="cart-product-name">
                                            <span class="amount color lead">
                                                <strong id=total-harga>
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
                            <button type="submit" id="button-submit" disabled class="button button-3d">Pesan
                                Sekarang</button>
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

    <script>
        $(document).ready(function() {
            // Mengambil data provinsi
            $.ajax({
                url: "{{ route('ongkir.province') }}",
                type: "GET",
                success: function(result) {
                    $.each(result, function(index, value) {
                        $.each(value.results, function(index2, value2) {
                            $('#province_origin').append(
                                '<option value="' + value2.province_id + '">' +
                                value2.province + '</option>'
                            );
                        });
                    });
                }
            });

            // Mengambil data kota berdasarkan provinsi terpilih
            $('#province_origin').on('change', function() {
                $.ajax({
                    url: "{{ route('ongkir.city', '') }}/" + this.value,
                    type: "GET",
                    success: function(result) {
                        $('#city_origin').empty();
                        $('#city_origin').append('<option value="">-- Pilih Kota --</option>');
                        $.each(result, function(index, value) {
                            $.each(value.results, function(index2, value2) {
                                $('#city_origin').append(
                                    '<option value="' + value2.city_id +
                                    '">' + value2.type + ' ' + value2
                                    .city_name + '</option>'
                                );
                            });
                        });
                        // set value name province dengan nama provinsi
                        $('#province').val($('#province_origin option:selected').text());
                    }
                });
            });

            // on change city_origin
            $('#city_origin').on('change', function() {
                $('#city').val($('#city_origin option:selected').text());
            });

            // Mengambil data ongkos kirim
            $('#courier').on('change', function() {
                let selectedCourier = $('#courier').val();
                if (selectedCourier == '') {
                    alert('Pilih kota terlebih dahulu!');
                    return false;
                }

                $.ajax({
                    url: "{{ route('ongkir.cost') }}",
                    type: "POST",
                    data: {
                        _token: '{{ csrf_token() }}',
                        origin: $('#city_origin').val(),
                        destination: '152',
                        weight: '1000',
                        courier: selectedCourier
                    },
                    success: function(result) {
                        $.each(result.rajaongkir.results, function(index, value) {
                            $('#cost').empty();
                            $('#cost').append(
                                '<option value="">-- Pilih Layanan Pengiriman --</option>'
                            );
                            $.each(value.costs, function(index2, value2) {
                                $('#cost').append(
                                    '<option value="' + value2.cost[0]
                                    .value +
                                    '">' + value2.service + '</option>'
                                );
                            });
                        });
                    }
                });
            });
            // Script saat #cost diubah, maka ubah juga #total-pengiriman dan #total-harga
            $('#cost').on('change', function() { // Ubah #total-pengiriman berdasarkan #cost value
                $('#button-submit').attr('disabled', false);
                $('#total-pengiriman').html('Rp. ' + $(this).val());

                // Ubah #total-harga berdasarkan #cost value menjadi total harga + ongkir dengan format mata uang
                let totalHarga = {{ $total }};
                let ongkir = parseInt($(this).val());
                let totalBelanja = totalHarga + ongkir;

                // Format angka menjadi format mata uang (misalnya: Rp. 10.000.000)
                let formattedTotalBelanja = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(totalBelanja);

                $('#total-harga').html(formattedTotalBelanja);

                // Format ongkir menjadi format mata uang dan ubah #total-pengiriman
                let formattedOngkir = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(ongkir);
                $('#total-pengiriman').html(formattedOngkir);

                // total ongkos kirim
                $('#total-ongkir').val(formattedOngkir);
                $('#total_ongkir').val(ongkir);

                // courier service
                $('#courier_service').val($('#cost option:selected').text());
            });
        });

        $('#button-submit').on('submit', function() {
            $('#button-submit').attr('disabled', true);
            // Change text to loading
            $('#button-submit').text('Loading...');
        });
    </script>
@endpush

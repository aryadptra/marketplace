@extends('layouts.app')

@section('title', 'Profile')

@section('content')
    <div class="container mt-5">
        <div class="row gx-5">
            <div class="col-md-9">
                <img src="/app/assets/images/icons/avatar.jpg" class="alignleft img-circle img-thumbnail my-0" alt="Avatar"
                    style="max-width: 84px;">
                <div class="heading-block border-0">
                    <h3>{{ Auth::user()->name }}</h3>
                    <span>Customer</span>
                </div>
                <div>
                    <ul class="nav canvas-alt-tabs tabs-alt tabs nav-tabs mb-3" id="tabs-profile" role="tablist"
                        style="--bs-nav-link-font-weight: 600;">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link container-modules-loaded active" id="canvas-home-alt-tab"
                                data-bs-toggle="pill" data-bs-target="#home-alt" type="button" role="tab"
                                aria-controls="canvas-home-alt" aria-selected="true"><i class="fa-solid fa-user me-1"></i>
                                Profil</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link container-modules-loaded" id="canvas-profile-alt-tab"
                                data-bs-toggle="pill" data-bs-target="#profile-alt" type="button" role="tab"
                                aria-controls="canvas-profile-alt" aria-selected="false" tabindex="-1"><i
                                    class="bi-cart me-1"></i> Transaksi</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link container-modules-loaded" id="canvas-contact-alt-tab"
                                data-bs-toggle="pill" data-bs-target="#contact-alt" type="button" role="tab"
                                aria-controls="canvas-contact-alt" aria-selected="false" tabindex="-1"><i
                                    class="fa-solid fa-money-bill me-1"></i> Pembayaran</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link container-modules-loaded" id="canvas-about-alt-tab"
                                data-bs-toggle="pill" data-bs-target="#about-alt" type="button" role="tab"
                                aria-controls="canvas-about-alt" aria-selected="false" tabindex="-1"><i
                                    class="bi-bank me-1"></i> Rekening Bank</button>
                        </li>
                    </ul>
                    <div id="canvas-TabContent2" class="tab-content">
                        <div class="tab-pane fade active show" id="home-alt" role="tabpanel"
                            aria-labelledby="canvas-home-tab" tabindex="0">

                            <p>
                                Informasi profil Anda. Anda dapat mengubahnya pada menu <a
                                    href="{{ route('profile-update') }}">Edit Profile</a>.
                            </p>
                            <table class="table table-bordered table-striped">
                                <tbody>
                                    <tr>
                                        <td>Nama</td>
                                        <td>{{ Auth::user()->name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{{ Auth::user()->email }}</td>
                                    </tr>
                                    <tr>
                                        <td>Alamat</td>
                                        <td>{{ Auth::user()->detail->address }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nomor Telepon</td>
                                        <td>{{ Auth::user()->detail->phone_number }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-pane fade" id="profile-alt" role="tabpanel" aria-labelledby="canvas-profile-tab"
                            tabindex="0">
                            <p>
                                Daftar seluruh transaksi yang telah dilakukan oleh Anda. Anda dapat melihat detail
                                pada tabel di bawah ini.
                            </p>
                            <table class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Waktu</th>
                                        <th>Nomor Faktur</th>
                                        <th>Metode Pembayaran</th>
                                        <th>Kode Pengiriman</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order as $item)
                                        <tr>
                                            <td>
                                                @if ($item->payment_status == 'Pending')
                                                    <span class="badge bg-warning">Pending</span>
                                                @endif
                                            </td>
                                            <td>{{ $item->created_at }}</td>
                                            <td>{{ $item->invoice_number }}</td>
                                            <td>{{ $item->payment_method }}</td>
                                            <td>{{ $item->shipping_code }}</td>
                                            <td>
                                                <a href="{{ route('order.show', $item->id) }}"
                                                    class="btn btn-sm btn-primary">Detail</a>
                                                {{-- Invoice Button --}}
                                                @if ($item->payment_status == 'Pending')
                                                    <a href="{{ route('order.invoice', $item->id) }}"
                                                        class="btn btn-sm btn-success">Invoice</a>
                                                @endif
                                                {{-- Cancel Button --}}
                                                @if ($item->payment_status == 'Pending')
                                                    <a href="{{ route('order.cancel', $item->id) }}"
                                                        class="btn btn-sm btn-danger">Cancel</a>
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-pane fade" id="contact-alt" role="tabpanel" aria-labelledby="canvas-contact-tab"
                            tabindex="0">
                        </div>
                        <div class="tab-pane fade" id="about-alt" role="tabpanel" aria-labelledby="canvas-about-tab"
                            tabindex="0">
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-100 line d-block d-md-none"></div>
            <div class="col-md-3">
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Profile</div><i class="uil uil-user"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Servers</div><i class="bi-laptop"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Messages</div><i class="bi-envelope"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Billing</div><i class="bi-credit-card"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Settings</div><i class="bi-gear-fill"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Logout</div><i class="bi-box-arrow-left"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('custom-script')
    
@endpush

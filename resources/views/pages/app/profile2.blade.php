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
                <div class="row">
                    <div class="col-lg-12">
                        <div>
                            <ul class="nav canvas-alt-tabs tabs-alt tabs nav-tabs mb-3" id="tabs-profile" role="tablist"
                                style="--bs-nav-link-font-weight: 600;">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="profile" data-bs-toggle="pill"
                                        data-bs-target="#profile" type="button" role="tab" aria-controls="profile"
                                        aria-selected="true"><i class="fa-solid fa-user me-1"></i> Profile</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="transaction-tab" data-bs-toggle="pill"
                                        data-bs-target="#transaction" type="button" role="tab"
                                        aria-controls="transaction" aria-selected="true"><i
                                            class="fa-solid fa-shopping-cart me-1"></i> Transaksi</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="canvas-profile-alt-tab" data-bs-toggle="pill"
                                        data-bs-target="#profile-alt" type="button" role="tab"
                                        aria-controls="canvas-profile-alt" aria-selected="false"><i
                                            class="fa-solid fa-money-bill me-1"></i> Pembayaran</button>
                                </li>
                            </ul>
                            <div id="canvas-TabContent2" class="tab-content">
                                <div class="tab-pane fade show active" id="profile" role="tabpanel"
                                    aria-labelledby="profile" tabindex="0">
                                </div>
                                <div class="tab-pane fade" id="transaction" role="tabpanel" aria-labelledby="transaction"
                                    tabindex="0">
                                    
                                </div>
                            </div>
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
                <div class="fancy-title mt-5 title-border">
                    <h4>About Me</h4>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum laboriosam, dignissimos veniam obcaecati.
                    Quasi eaque, odio assumenda porro explicabo laborum!</p>
                <div class="fancy-title mt-5 title-border">
                    <h4>Social Profiles</h4>
                </div>
                <a href="#" class="social-icon h-bg-facebook si-small rounded-circle bg-light" title="Facebook">
                    <i class="fa-brands fa-facebook-f"></i>
                    <i class="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" class="social-icon h-bg-google si-small rounded-circle bg-light" title="Google+">
                    <i class="fa-brands fa-google"></i>
                    <i class="fa-brands fa-google"></i>
                </a>
                <a href="#" class="social-icon h-bg-dribbble si-small rounded-circle bg-light" title="Dribbble">
                    <i class="fa-brands fa-dribbble"></i>
                    <i class="fa-brands fa-dribbble"></i>
                </a>
                <a href="#" class="social-icon h-bg-flickr si-small rounded-circle bg-light" title="Flickr">
                    <i class="fa-brands fa-flickr"></i>
                    <i class="fa-brands fa-flickr"></i>
                </a>
                <a href="#" class="social-icon h-bg-linkedin si-small rounded-circle bg-light" title="LinkedIn">
                    <i class="fa-brands fa-linkedin"></i>
                    <i class="fa-brands fa-linkedin"></i>
                </a>
                <a href="#" class="social-icon h-bg-twitter si-small rounded-circle bg-light" title="Twitter">
                    <i class="fa-brands fa-twitter"></i>
                    <i class="fa-brands fa-twitter"></i>
                </a>
            </div>
        </div>
    </div>
@endsection

@php
    $categories = App\Models\Category::all();
@endphp

<header id="header" class="full-header header-size-md">
    <div id="header-wrap">
        <div class="container-fluid">
            <div class="header-row justify-content-lg-between">
                <div id="logo" class="me-lg-4">
                    <a href="{{ route('home') }}">
                        <img class="logo-default"
                            srcset="/app/assets/demos/shop/images/logo.png, /app/assets/demos/shop/images/logo@2x.png 2x"
                            src="/app/assets/demos/shop/images/logo@2x.png" alt="Canvas Logo">
                    </a>
                </div>
                <div class="header-misc">
                    <div id="top-account">
                        @php
                            $user = Auth::user();
                        @endphp
                        @if ($user)
                            <a href="{{ route('profile') }}"><i class="bi-person me-1 position-relative"
                                    style="top: 1px;"></i><span
                                    class="d-none d-sm-inline-block font-primary fw-medium">{{ $user->name }}</span></a>
                        @else
                            <a href="#modal-register" data-lightbox="inline"><i class="bi-person me-1 position-relative"
                                    style="top: 1px;"></i><span
                                    class="d-none d-sm-inline-block font-primary fw-medium">Login</span></a>
                        @endif
                    </div>
                    @php
                        // Cek apakah user sudah login
                        if ($user) {
                            $carts = \App\Models\Cart::where('user_id', Auth::user()->id)->count();
                        } else {
                            $carts = 0; // Jika user belum login, jumlah cart dianggap 0
                        }
                    @endphp
                    <div id="top-cart" class="header-misc-icon d-none d-sm-block">
                        <a href="#" id="top-cart-trigger"><i class="uil uil-shopping-bag"></i><span
                                class="top-cart-number">5</span></a>
                        <div class="top-cart-content">
                            <div class="top-cart-title">
                                <h4>Keranjang</h4>
                            </div>
                            <div class="top-cart-items">
                                @if (Auth::check())
                                    @if ($carts > 0)
                                        @foreach ($cart as $item)
                                            <div class="top-cart-item">
                                                <div class="top-cart-item-image">
                                                    <a href="{{ route('product.detail', $item->product->slug) }}"><img
                                                            src="{{ Storage::url($item->product->thumbnail ?? '') }}"
                                                            alt="{{ $item->product->name }}"></a>
                                                </div>
                                                <div class="top-cart-item-desc">
                                                    <div class="top-cart-item-desc-title">
                                                        <a
                                                            href="{{ route('product.detail', $item->product->slug) }}">{{ $item->product->name }}</a>
                                                        <span class="top-cart-item-price d-block">Rp.
                                                            {{ number_format($item->product->price, 0, ',', '.') }}</span>
                                                    </div>
                                                    <div class="top-cart-item-quantity">x{{ $item->quantity }}</div>
                                                </div>
                                            </div>
                                        @endforeach
                                    @endif
                                @endif
                            </div>
                            <div class="top-cart-action">
                                <span class="top-checkout-price">
                                    <span class="top-checkout-price-currency">Rp.</span>
                                    @if (Auth::check())
                                        @php
                                            $total = 0;
                                            if ($carts > 0) {
                                                foreach ($cart as $item) {
                                                    $total += $item->product->price * $item->quantity;
                                                }
                                            }
                                        @endphp
                                        <span class="top-checkout-price-amount"
                                            data-price="{{ number_format($total, 0, ',', '.') }}">{{ number_format($total, 0, ',', '.') }}</span>
                                    @endif
                                </span>
                                <a href="{{ route('cart') }}" class="button button-3d button-small m-0">View Cart</a>
                            </div>
                        </div>
                    </div>
                    <div id="top-search" class="header-misc-icon">
                        <a href="#" id="top-search-trigger"><i class="uil uil-search"></i><i
                                class="bi-x-lg"></i></a>
                    </div>
                </div>
                <div class="primary-menu-trigger">
                    <button class="cnvs-hamburger" type="button" title="Open Mobile Menu">
                        <span class="cnvs-hamburger-box"><span class="cnvs-hamburger-inner"></span></span>
                    </button>
                </div>
                <nav class="primary-menu with-arrows me-lg-auto">
                    <ul class="menu-container">
                        <li class="menu-item current"><a class="menu-link" href="#">
                                <div>Beranda</div>
                            </a></li>
                        <li class="menu-item"><a class="menu-link" href="#">
                                <div>
                                    Flash Sale
                                </div>
                            </a></li>
                        <li class="menu-item mega-menu mega-menu-small"><a class="menu-link" href="#">
                                <div>Kategori</div>
                            </a>
                            <div class="mega-menu-content mega-menu-style-2">
                                <div class="container">
                                    <div class="row">
                                        <ul class="sub-menu-container mega-menu-column col-lg-6">
                                            @foreach ($categories as $category)
                                                @if ($category->parent_id === 0)
                                                    <li class="menu-item mega-menu-title">
                                                        <a class="menu-link" href="#">
                                                            <div>{{ $category->name }}</div>
                                                        </a>
                                                        <ul class="sub-menu-container">
                                                            @foreach ($categories as $childCategory)
                                                                @if ($childCategory->parent_id === $category->id)
                                                                    <li class="menu-item">
                                                                        <a class="menu-link" href="#">
                                                                            <div>{{ $childCategory->name }}</div>
                                                                        </a>
                                                                    </li>
                                                                @endif
                                                            @endforeach
                                                        </ul>
                                                    </li>
                                                @endif
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="menu-item"><a class="menu-link" href="#">
                                <div>Vendor</div>
                            </a></li>
                    </ul>
                </nav>
                <form class="top-search-form" action="search.html" method="get">
                    <input type="text" name="q" class="form-control" value=""
                        placeholder="Type &amp; Hit Enter.." autocomplete="off">
                </form>
            </div>
        </div>
    </div>
    <div class="header-wrap-clone"></div>
</header>

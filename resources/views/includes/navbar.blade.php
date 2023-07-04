<nav class="navbar navbar-expand-lg navbar-light navbar-store fixed-top navbar-fixed-top" data-aos="fade-down">
    <div class="container">
        <a href="{{ route('home') }}" class="navbar-brand">
            <img src="/images/logo.svg" alt="Logo" />
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a href="{{ route('home') }}" class="nav-link {{ request()->is('/') ? 'active' : '' }}">Home</a>
                </li>
                <li class="nav-item dropdown {{ request()->is('catalog') ? 'active' : '' }}">
                    <a class="nav-link dropdown-toggle " href="#" role="button" data-toggle="dropdown"
                        aria-expanded="false">
                        Products
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="{{ route('catalog') }}">Catalog</a>
                        <a class="dropdown-item" href="{{ route('categories') }}">Categories</a>
                        <a class="dropdown-item" href="#">Top Brands</a>
                    </div>
                </li>
                <li class="nav-item dropdown {{ request()->is('categories') ? 'active' : '' }}">
                    <a class="nav-link dropdown-toggle " href="#" role="button" data-toggle="dropdown"
                        aria-expanded="false">
                        Categories
                    </a>
                    <div class="dropdown-menu scrollable-menu">
                        {{-- Foreach Categories --}}
                        @foreach ($categories as $category)
                            <a class="dropdown-item" href="{{ route('categories-detail', $category->slug) }}">
                                {{ $category->name }}
                            </a>
                        @endforeach
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Flash Sale</a>
                </li>
            </ul>

            <ul class="navbar-nav ml-auto">
                <li class="nav-item mr-md-2">
                    <button type="button" data-toggle="modal" data-target="#exampleModal"
                        class="nav-link btn btn-secondary btn-block btn-search text-white">
                        {{-- Font Awesome Search --}}
                        <i class="fas fa-search"></i>
                    </button>
                </li>
                @guest
                    {{-- <li class="nav-item">
                        <a href="{{ route('register') }}" class="btn btn-signup nav-link px-4">Sign
                            Up</a>
                    </li> --}}
                    <li class="nav-item">
                        <a href="{{ route('login') }}" class="btn btn-success nav-link px-4 text-white mt-2 mt-md-0">Sign
                            In</a>
                    </li>
                @endguest
            </ul>

            @auth
                <!-- Desktop Menu -->
                <ul class="navbar-nav d-none d-lg-flex">
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link" id="navbarDropdown" role="button" data-toggle="dropdown">
                            <img src="/images/icon-user.png" alt="" class="rounded-circle mr-2 profile-picture" />
                            {{ strtok(Auth::user()->name, ' ') }}
                        </a>
                        <div class="dropdown-menu">
                            <a href="{{ route('dashboard') }}" class="dropdown-item">Dashboard</a>
                            <a href="{{ route('dashboard-settings-account') }}" class="dropdown-item">
                                Settings
                            </a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="{{ route('logout') }}"
                                onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                Logout
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                @csrf
                            </form>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="{{ route('cart') }}" class="nav-link d-inline-block mt-2">
                            @php
                                $carts = \App\Cart::where('users_id', Auth::user()->id)->count();
                            @endphp
                            @if ($carts > 0)
                                <img src="/images/icon-cart-filled.svg" alt="" />
                                <div class="card-badge">{{ $carts }}</div>
                            @else
                                <img src="/images/icon-cart-empty.svg" alt="" />
                            @endif
                        </a>
                    </li>
                </ul>

                <ul class="navbar-nav d-block d-lg-none">
                    <li class="nav-item">
                        <a href="{{ route('dashboard') }}" class="nav-link">
                            Hi, {{ Auth::user()->name }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{ route('cart') }}" class="nav-link d-inline-block">
                            Cart
                        </a>
                    </li>
                </ul>
            @endauth
        </div>
    </div>
</nav>


<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                {{-- Search Form --}}
                <form action="#" method="GET">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search here" name="search"
                            value="{{ request()->search }}">
                        <div class="input-group-append">
                            <button class="btn btn-success" type="submit">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

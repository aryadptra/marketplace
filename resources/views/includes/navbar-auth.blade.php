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
                <li class="nav-item dropdown {{ request()->is('categories') ? 'active' : '' }}">
                    <a class="nav-link dropdown-toggle " href="#" role="button" data-toggle="dropdown"
                        aria-expanded="false">
                        Products
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Catalog</a>
                        <a class="dropdown-item" href="{{ route('categories') }}">Categories</a>
                        <a class="dropdown-item" href="#">Top Brands</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Flash Sale</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

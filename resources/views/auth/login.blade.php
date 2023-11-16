@extends('layouts.app')

@push('add-content')
    <section class="page-title bg-transparent">
        <div class="container">
            <div class="page-title-row">
                <div class="page-title-content">
                    <h1>My Account</h1>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Authentication</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Login</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
@endpush

@section('content')
    <div class="content-wrap">
        <div class="container">
            <div class="accordion accordion-lg mx-auto mb-0" style="max-width: 550px;">
                <div class="accordion-header accordion-active">
                    <div class="accordion-icon">
                        <i class="accordion-closed fa-solid fa-lock"></i>
                        <i class="accordion-open bi-unlock"></i>
                    </div>
                    <div class="accordion-title">
                        Login to your Account
                    </div>
                </div>
                <div class="accordion-content" style="display: block;">
                    <form id="login-form" method="POST" class="row mb-0" action="{{ route('login') }}">
                        @csrf
                        <div class="col-12 form-group">
                            <label for="login-form-username">Email Address:</label>
                            <input type="email" id="login-form-username" @error('email') is-invalid @enderror"
                                name="email" value="{{ old('email') }}" required autocomplete="email" autofocus
                                class="form-control">
                            @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="login-form-password">Password:</label>
                            <input type="password" id="login-form-password"@error('password') is-invalid @enderror"
                                name="password" required autocomplete="current-password" class="form-control">

                            @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-md-12 ">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="remember" id="remember"
                                    {{ old('remember') ? 'checked' : '' }}>
                                <label class="form-check-label" for="remember">
                                    {{ __('Remember Me') }}
                                </label>
                            </div>
                        </div>
                        <div class="col-12 form-group">
                            <div class="d-flex justify-content-between">
                                <button class="button button-3d button-black m-0" id="login-form-submit"
                                    type="submit">Login</button>
                                @if (Route::has('password.request'))
                                    <a href="{{ route('password.request') }}">Forgot Password?</a>
                                @endif
                            </div>
                        </div>
                    </form>
                </div>
                <div class="accordion-header">
                    <div class="accordion-icon">
                        <i class="accordion-closed bi-person"></i>
                        <i class="accordion-open bi-check-circle-fill"></i>
                    </div>
                    <div class="accordion-title">
                        New Signup? Register for an Account
                    </div>
                </div>
                <div class="accordion-content" style="display: none;">
                    <form class="row mb-0" method="POST" action="{{ route('register') }}">
                        @csrf
                        <div class="col-12 form-group">
                            <label for="register-form-name">Name:</label>
                            <input id="name" type="text" class="form-control @error('name') is-invalid @enderror"
                                name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>
                            @error('name')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-email">Email:</label>
                            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror"
                                name="email" value="{{ old('email') }}" required autocomplete="email">
                            @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-phone">Phone Number:</label>
                            <input type="number" name="phone_number" class="form-control">
                            @error('phone_number')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-address">Address:</label>
                            <textarea name="address" class="form-control" cols="10" rows="3"></textarea>
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-phone">Postal Code:</label>
                            <input type="number" name="postal_code" class="form-control">
                            @error('postal_code')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-name">Country:</label>
                            <input id="country" type="text"
                                class="form-control @error('country') is-invalid @enderror" name="country"
                                value="{{ old('country') }}" required autocomplete="country" autofocus>
                            @error('country')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-password">Choose Password:</label>
                            <input id="password" type="password"
                                class="form-control @error('password') is-invalid @enderror" name="password" required
                                autocomplete="new-password">

                            @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-repassword">Re-enter Password:</label>
                            <input id="password-confirm" type="password" class="form-control"
                                name="password_confirmation" required autocomplete="new-password">
                        </div>
                        <div class="col-12 form-group">
                            <button class="button button-3d button-black m-0" type="submit">Register Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

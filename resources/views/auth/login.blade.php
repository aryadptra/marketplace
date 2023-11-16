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
                    <form id="register-form" name="register-form" class="row mb-0" method="POST"
                        action="{{ route('register') }}">
                        <div class="col-12 form-group">
                            <label for="register-form-name">Name:</label>
                            <input type="text" id="register-form-name" name="register-form-name" value=""
                                class="form-control">
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-email">Email Address:</label>
                            <input type="text" id="register-form-email" name="register-form-email" value=""
                                class="form-control">
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-username">Choose a Username:</label>
                            <input type="text" id="register-form-username" name="register-form-username" value=""
                                class="form-control">
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-phone">Phone:</label>
                            <input type="text" id="register-form-phone" name="register-form-phone" value=""
                                class="form-control">
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-password">Choose Password:</label>
                            <input type="password" id="register-form-password" name="register-form-password"
                                value="" class="form-control">
                        </div>
                        <div class="col-12 form-group">
                            <label for="register-form-repassword">Re-enter Password:</label>
                            <input type="password" id="register-form-repassword" name="register-form-repassword"
                                value="" class="form-control">
                        </div>
                        <div class="col-12 form-group">
                            <button class="button button-3d button-black m-0" id="register-form-submit"
                                name="register-form-submit" value="register">Register Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

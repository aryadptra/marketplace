<div class="modal1 mfp-hide" id="modal-register">
    <div class="card mx-auto" style="max-width: 540px;">
        <div class="card-header py-3 bg-transparent text-center">
            <h3 class="mb-0 fw-normal">Hello, Selamat Datang</h3>
        </div>
        <div class="card-body mx-auto py-5" style="max-width: 70%;">
            <h3 class="text-center">Silahkan login</h3>
            {{-- <form id="login-form" name="login-form" class="mb-0 row mt-5" action="#" method="post"> --}}
            <form method="POST" class="mb-0 row mt-5" action="{{ route('login') }}">
                @csrf
                <div class="col-12">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required
                        autocomplete="email" autofocus class="form-control not-dark" placeholder="Email Anda">
                    @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
                <div class="col-12 mt-4">
                    <label for="email">Password</label>
                    <input id="password" type="password" name="password" value="" class="form-control not-dark"
                        placeholder="Password" required autocomplete="current-password">
                    @error('password')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
                <div class="col-12 text-end">
                    <a href="#" class="text-dark fw-light mt-2">Lupa Password?</a>
                </div>
                <div class="col-12 mt-4">
                    <button class="button w-100 m-0" id="login-form-submit" name="login-form-submit"
                        value="login">Login</button>
                </div>
            </form>
        </div>
        <div class="card-footer py-4 text-center">
            <p class="mb-0">Don't have an account? <a href="#"><u>Sign up</u></a></p>
        </div>
    </div>
</div>

<!DOCTYPE html>
<html dir="ltr" lang="en-US">

<head>
    @include('includes.app.meta')
    <title>@yield('title', 'App') | {{ config('app.name', 'Laravel') }}</title>
    @include('includes.app.style')
    @stack('custom-style')
</head>

<body class="stretched" style="background-color: white !important;">
    @include('sweetalert::alert')
    <div id="wrapper">
        {{-- @include('includes.app.onloader') --}}
        @include('includes.app.login')
        @include('includes.app.topbar')
        @include('includes.app.navbar')
        @stack('add-content')
        @yield('content')
        <div class="content">
            <div class="content-wrap">
                <div class="container-fluid">
                </div>
            </div>
        </div>
        @include('includes.app.footer')
    </div>
    <div id="gotoTop" class="bi-arrow-up"></div>
    @include('includes.app.script')
    @stack('custom-script')
</body>

</html>

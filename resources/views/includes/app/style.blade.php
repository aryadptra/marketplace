<!-- Font Imports -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
    href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;1,300;1,400&display=swap"
    rel="stylesheet">
<!-- Core Style -->
<link rel="stylesheet" href="{{ asset('app/assets/style.css') }}">
<!-- Font Icons -->
<link rel="stylesheet" href="{{ asset('app/assets/css/font-icons.css') }}">
<!-- Plugins/Components CSS -->
<link rel="stylesheet" href="{{ asset('app/assets/css/swiper.css') }}">
<!-- Niche Demos -->
<link rel="stylesheet" href="{{ asset('app/assets/demos/shop/shop.css') }}">
<!-- Custom CSS -->
<link rel="stylesheet" href="{{ asset('app/assets/css/custom.css') }}">
{{-- Vite --}}
@vite(['resources/sass/app.scss', 'resources/js/app.js'])

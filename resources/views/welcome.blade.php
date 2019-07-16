<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Composition Seven</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="./css/app.css">
</head>

<body>
    <div class="flex-center position-ref full-height">
        @if (Route::has('login'))
        <div class="top-right links">
            @auth
            <a href="{{ url('/home') }}">Home</a>
            @else
            <a href="{{ route('login') }}">Login</a>

            @if (Route::has('register'))
            <a href="{{ route('register') }}">Register</a>
            @endif
            @endauth
        </div>
        @endif

        <div class="content">
            <div class="button-wrapper">
                <button id="make-some-noise">noise</button>
            </div>
            <div class="grid-wrapper">
                <div class="grid-row">
                    <div class="column" data-cell-number="0" data-on="false"></div>
                    <div class="column" data-cell-number="1" data-on="false"></div>
                    <div class="column" data-cell-number="2" data-on="false"></div>
                    <div class="column" data-cell-number="3" data-on="false"></div>
                    <div class="column" data-cell-number="4" data-on="false"></div>
                    <div class="column" data-cell-number="5" data-on="false"></div>
                    <div class="column" data-cell-number="6" data-on="false"></div>
                    <div class="column" data-cell-number="7" data-on="false"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="/js/app.js"> </script>
</body>

</html>
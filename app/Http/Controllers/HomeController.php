<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use JavaScript;

class HomeController extends Controller
{
    public function show () {
        return view('app');
    }
}

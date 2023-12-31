<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $product = \App\Models\Product::all();
        $categories = \App\Models\Category::all();
        return view('pages.app.index', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function raja()
    {
    }
}

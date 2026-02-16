<?php

namespace App\Http\Controllers;

use App\Mail\Checkout;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

/*
    GET|HEAD        Cart ....................................... Cart.index › CartController@index
    POST            Cart ....................................... Cart.store › CartController@store
    GET|HEAD        Cart/create .............................. Cart.create › CartController@create
    GET|HEAD        Cart/{cart} .................................. Cart.show › CartController@show
    PUT|PATCH       Cart/{cart} .............................. Cart.update › CartController@update
    DELETE          Cart/{cart} ............................ Cart.destroy › CartController@destroy  
    GET|HEAD        Cart/{cart}/edit ............................. Cart.edit › CartController@edit 
 */

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = auth()->user()
            ->carts()
            ->with('product')
            ->get();

        return Inertia::render('Cart/Index', [
            'Data' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            // 'price' => 'required|numeric',
            // 'total' => 'required|numeric',
        ]);
        $product = Product::findOrFail($request->product_id);

        $cart = Cart::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($cart) {
            // 🔹 Increase quantity
            $cart->quantity += $request->quantity;
            $cart->total = $cart->quantity * $product->price;
            $cart->save();
        } else {
            // 🔹 New cart item
            Cart::create([
                'user_id'    => auth()->id(),
                'product_id' => $product->id,
                'quantity'   => $request->quantity,
                'price'      => $product->price,
                'total'      => $product->price * $request->quantity,
            ]);
        }

        return back()->with('success', 'Product added to cart');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cart $cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();
        return redirect(route('Cart.index'))->with('success','Deleted');
    }


}

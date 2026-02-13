<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = auth()->user()->carts()->with('product')->get();
        return Inertia::render('Checkout/Index', [
            'cart' => $cart
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_line1' => 'required',
            'city' => 'required',
            'state' => 'required',
            'postal_code' => 'required',
            'country' => 'required',
        ]);

        $userId = auth()->id();
        $cartItems = Cart::where('user_id', $userId)->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Cart is empty');
        }

        $subtotal = $cartItems->sum(fn($item) => $item->total);
        $tax = $subtotal * 0.05;
        $shipping = 50;
        $total = $subtotal + $tax + $shipping;

        $order = Order::create([
            'user_id' => $userId,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'address_line1' => $request->address_line1,
            'address_line2' => $request->address_line2,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
        ]);

        foreach ($cartItems as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->total,
            ]);
        }

        // Clear cart
        Cart::where('user_id', $userId)->delete();

        return redirect()->route('Products.index', $order->id);
    }
}




//If need quantity change

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'address_line1' => 'required',
    //         'city' => 'required',
    //         'state' => 'required',
    //         'postal_code' => 'required',
    //         'country' => 'required',
    //     ]);

    //     $userId = auth()->id();
    //     $cartItems = Cart::where('user_id', $userId)->get();

    //     if ($cartItems->isEmpty()) {
    //         return back()->with('error', 'Cart is empty');
    //     }

    //     $subtotal = $cartItems->sum(fn($item) => $item->total);
    //     $tax = $subtotal * 0.05;
    //     $shipping = 50;
    //     $total = $subtotal + $tax + $shipping;

    //     $order = Order::create([
    //         'user_id' => $userId,
    //         'subtotal' => $subtotal,
    //         'tax' => $tax,
    //         'shipping' => $shipping,
    //         'total' => $total,
    //         'address_line1' => $request->address_line1,
    //         'address_line2' => $request->address_line2,
    //         'city' => $request->city,
    //         'state' => $request->state,
    //         'postal_code' => $request->postal_code,
    //         'country' => $request->country,
    //     ]);

    //     foreach ($cartItems as $item) {
    //         $order->items()->create([
    //             'product_id' => $item->product_id,
    //             'quantity' => $item->quantity,
    //             'price' => $item->price,
    //             'total' => $item->total,
    //         ]);

    //         // Decrease product quantity here
    //         $product = Product::find($item->product_id);
    //         if ($product) {
    //             $product->quantity = max(0, $product->quantity - $item->quantity);
    //             $product->save();
    //         }
    //     }

    //     // Clear cart
    //     Cart::where('user_id', $userId)->delete();

    //     return redirect()->route('Products.index', $order->id);
    // }

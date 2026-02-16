<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        DB::beginTransaction();

        try {

            // 🔹 CHECK STOCK FIRST
            foreach ($cartItems as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);

                if (!$product || $product->quantity < $item->quantity) {
                    DB::rollBack();
                    return back()->with('error', "Not enough stock for {$product->name}");
                }
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

                $product = Product::lockForUpdate()->find($item->product_id);

                // 🔹 Create order item
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->total,
                ]);

                // 🔹 Decrease stock safely
                $product->decrement('quantity', $item->quantity);
            }

            // 🔹 Clear cart
            Cart::where('user_id', $userId)->delete();

            DB::commit();

            return redirect()->route('Products.index', $order->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Something went wrong $e->getMessage()');
        }


    }
}


// lockForUpdate()
// Prevents this situation:
// User A buys last 2 items
// User B buys same 2 items at same time
// Stock becomes -2 ❌
// lockForUpdate() locks that row until transaction finishes.


// decrement() is Atomic
// $product->decrement('quantity', $item->quantity);
// This is safe and optimized.

// =======================================================================================
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

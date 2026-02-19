<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
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

    public function store(Request $request )
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

            // ===============================
            // 1️⃣ LOCK PRODUCTS & CHECK STOCK
            // ===============================
            $products = [];

            foreach ($cartItems as $item) {

                $product = Product::lockForUpdate()->find($item->product_id);

                if (!$product) {
                    DB::rollBack();
                    return back()->with('error', 'Product not found.');
                }

                if ($product->quantity < $item->quantity) {
                    DB::rollBack();
                    return back()->with('error', "Not enough stock for {$product->name}");
                }

                $products[$item->product_id] = $product;
            }

            // ===============================
            // 2️⃣ CALCULATE TOTALS
            // ===============================
            $subtotal = $cartItems->sum(fn($item) => $item->total);
            $tax = $subtotal * 0.05;
            $shipping = 50;
            $total = $subtotal + $tax + $shipping;

            // ===============================
            // 3️⃣ CHECK WALLET BALANCE FIRST
            // ===============================
            $walletUpdated = User::where('id', $userId)
                ->where('Wallet', '>=', $total)
                ->decrement('Wallet', $total);

            if (!$walletUpdated) {
                DB::rollBack();
                return back()->with('error', 'Insufficient wallet balance.');
            }

            // ===============================
            // 4️⃣ CREATE ORDER
            // ===============================
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

            // ===============================
            // 5️⃣ CREATE ORDER ITEMS + UPDATE STOCK
            // ===============================
            foreach ($cartItems as $item) {

                $product = $products[$item->product_id];

                // Create order item
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->total,
                ]);

                // Decrease stock safely
                $product->decrement('quantity', $item->quantity);

                // Increase seller wallet (example: seller gets item total)
                User::where('id', $product->created_by)
                    ->increment('Wallet', $item->total);
            }

            // ===============================
            // 6️⃣ CLEAR CART
            // ===============================
            Cart::where('user_id', $userId)->delete();

            DB::commit();

            return redirect()
                ->route('orders.show', $order->id)
                ->with('success', 'Order placed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
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

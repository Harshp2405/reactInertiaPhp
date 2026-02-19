<?php

namespace App\Http\Controllers\OrderManager;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class orderManager extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('user')->latest()->get()->fresh();

        return Inertia::render('orderManager/dashboard', [
            'orders' => $orders,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.product.images'
        ]);

        return Inertia::render('orderManager/Show', [
            'order' => $order,
            'user' => auth()->user()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        // return back()->with('success', 'Order status updated successfully.');
        return inertia()->location(route('ordermanager.order.show', $order->id  ));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }

    public function dashboard()
    {
        $totalOrders = Order::count();

        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $shippedOrders = Order::where('status', 'shipped')->count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();
        $thisMonthOrders = Order::whereMonth('created_at', now()->month)->count();
        $todayOrders = Order::whereDate('created_at', today())->count();


        $todayRevenue = Order::whereDate('created_at', Carbon::today())
            ->sum('total');

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        $orderData = [
           'totalOrders'=> $totalOrders,
           'pendingOrders'=> $pendingOrders,
           'processingOrders'=> $processingOrders,
           'shippedOrders'=> $shippedOrders,
           'cancelledOrders'=> $cancelledOrders,
           'thisMonthOrders'=> $thisMonthOrders,
           'todayOrders'=> $todayOrders,
           'todayRevenue'=> $todayRevenue,
           'recentOrders'=> $recentOrders,
           'deliveredOrders'=> $deliveredOrders
        ];
        return inertia('orderManager/dashboard', [
            'orderData' => $orderData,
        ]);
    }
}

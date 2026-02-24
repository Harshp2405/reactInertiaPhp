<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\orderitem;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class accountManager extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(orderitem $orderitem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(orderitem $orderitem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, orderitem $orderitem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(orderitem $orderitem)
    {
        //
    }

    public function dashboard()
    {

        // Today
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        // Orders count
        $totalOrders = Order::count();
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $thisMonthOrders = Order::where('created_at', '>=', $thisMonth)->count();

        // Revenue
        $todayRevenue = Order::whereDate('created_at', $today)->sum('total');
        $thisMonthRevenue = Order::where('created_at', '>=', $thisMonth)->sum('total');
        $totalRevenue = Order::sum('total');

        // Orders by status
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $shippedOrders = Order::where('status', 'shipped')->count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // Recent Orders (latest 5)
        $recentOrders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $salesData = [
            'totalOrders' => $totalOrders,
            'todayOrders' => $todayOrders,
            'thisMonthOrders' => $thisMonthOrders,
            'totalRevenue' => $totalRevenue,
            'todayRevenue' => $todayRevenue,
            'thisMonthRevenue' => $thisMonthRevenue,
            'pendingOrders' => $pendingOrders,
            'processingOrders' => $processingOrders,
            'shippedOrders' => $shippedOrders,
            'deliveredOrders' => $deliveredOrders,
            'cancelledOrders' => $cancelledOrders,
            'recentOrders' => $recentOrders,
        ];
        return inertia('Accountant/dashboard', [
            'salesData' => $salesData,
        ]);
    }
}

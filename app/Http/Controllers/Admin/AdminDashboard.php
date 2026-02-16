<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AdminDashboard extends Controller
{
    public function dashBoardData()
    {


        $userCount = User::count();
        $orderCount = Order::count();
        $product = Product::count();
        $lowStockProducts = Product::where('quantity', '<', 20)->get();
        $category = Product::where("parent_id", null)->count();
        $pandingOrders = Order::where('status', 'pending')->count();
        $ProcessingOrders = Order::where('status', 'processing')->count();
        $ShippedOrders = Order::where('status', 'shipped')->count();
        $DeliveredOrders = Order::where('status', 'delivered')->count();
        $CancelledOrders = Order::where('status', 'cancelled')->count();
        $BestsellingProducts = OrderItem::with('products')
            ->selectRaw('product_id, COUNT(*) as count')
            ->groupBy('product_id')
            ->orderByDesc('count')
            ->limit(3);

        $TotalSales = Order::sum('subtotal');
        $TodaySales = Order::whereDate('created_at', now()->toDateString())->sum('subtotal');
        $TodayOrder = Order::whereDate('created_at', now()->toDateString())->count();
        $SalesByDate = Order::selectRaw('DATE(created_at) as date, SUM(subtotal) as total')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $SalesByMonth = Order::selectRaw('MONTH(created_at) as month, SUM(subtotal) as total')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $data = [
            'userCount' => $userCount,
            'orderCount' => $orderCount,
            "lowStockProducts"=> $lowStockProducts,
            'productCount' => $product,
            'categoryCount' => $category,
            'pandingOrders' => $pandingOrders,
            'ProcessingOrders' => $ProcessingOrders,
            'ShippedOrders' => $ShippedOrders,
            'DeliveredOrders' => $DeliveredOrders,
            'CancelledOrders' => $CancelledOrders,
            'BestsellingProducts' => $BestsellingProducts,
            'TotalSales' => $TotalSales,
            'TodaySales' => $TodaySales,
            'TodayOrder' => $TodayOrder,
            'SalesByDate'=> $SalesByDate,
            'SalesbyMonth' => $SalesByMonth,
            
        ];


        return Inertia::render('admin/dashboard', [
            'stats' => $data
        ]);
    }
}

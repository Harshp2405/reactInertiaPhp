// resources/js/Pages/Admin/Dashboard.tsx

import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    IndianRupee ,
    ShoppingCart,
    Users,
    Boxes,
    Box,
} from 'lucide-react';
import Chart from './Charts/Chart';
const breadcrumbs = [
    {
        title: 'Dashboard',
        href: 'admin/dashboard',
    },
];
export default function Dashboard({stats}) {
    const cards = [
        {
            title: 'Total Users',
            value: stats.userCount,
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Products',
            value: stats.productCount,
            icon: Box,
            color: 'bg-green-500',
        },
        {
            title: 'Total Orders',
            value: stats.orderCount,
            icon: ShoppingCart,
            color: 'bg-yellow-500',
        },
        {
            title: 'Today Sales',
            value: `₹ ${stats.TodaySales}`,
            icon: IndianRupee ,
            color: 'bg-purple-500',
        },
        {
            title: 'Total Sales',
            value: `₹ ${stats.TotalSales}`,
            icon: IndianRupee ,
            color: 'bg-indigo-500',
        },
        {
            title: 'Categories',
            value: stats.categoryCount,
            icon: Boxes,
            color: 'bg-red-500',
        },
    ];
    console.log(stats)
    // console.log(stats.SalesByDate.map((data) => data.date.split('-')[2]));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6">
                {/* Top Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className={`flex flex-col items-start justify-center rounded-xl p-4 text-white ${card.color}`}
                        >
                            <div className="flex items-center gap-2">
                                <card.icon className="h-6 w-6 opacity-90" />
                                <h3 className="text-sm font-medium">
                                    {card.title}
                                </h3>
                            </div>
                            <p className="mt-2 text-2xl font-bold">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bestselling Products */}
                <div className="mt-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
                        Top 3 Bestselling Products
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {stats.BestsellingProducts &&
                        stats.BestsellingProducts.length > 0 ? (
                            stats.BestsellingProducts.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                                >
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                                        {item.product?.name ||
                                            'Unnamed Product'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Ordered {item.count} times
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                No bestselling products yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* Orders Status Overview */}
                <div className="mt-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
                        Orders Overview
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">Pending Orders</h3>
                            <p className="text-2xl font-bold">
                                {stats.pandingOrders}
                            </p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">Processing Orders</h3>
                            <p className="text-2xl font-bold">
                                {stats.ProcessingOrders}
                            </p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">Delivered Orders</h3>
                            <p className="text-2xl font-bold">
                                {stats.DeliveredOrders}
                            </p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">Today Sales</h3>
                            <p className="text-2xl font-bold">
                                {stats.TodaySales}
                            </p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">Today Order</h3>
                            <p className="text-2xl font-bold">
                                {stats.TodayOrder}
                            </p>
                        </div>
                    </div>
                </div>

                <Chart
                    stats={stats}
                    SalesByDate={stats.SalesByDate.map(
                        (data) => data.date.split('-')[2],
                    )}
                />
            </div>
        </AppLayout>
    );
}

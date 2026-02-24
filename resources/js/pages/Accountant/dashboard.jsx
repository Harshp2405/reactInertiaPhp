import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Dashboard() {
    const { salesData } = usePage().props;
console.log(salesData)
    return (
        <AppLayout>
            <h1 className="mb-4 text-2xl font-bold">Accountant Dashboard</h1>

            <div className="mb-8 grid grid-cols-3 gap-4">
                <div className="rounded  p-4">
                    <h2 className="font-semibold">Total Orders</h2>
                    <p>{salesData.totalOrders}</p>
                </div>
                <div className="rounded  p-4">
                    <h2 className="font-semibold">Today's Orders</h2>
                    <p>{salesData.todayOrders}</p>
                </div>
                <div className="rounded  p-4">
                    <h2 className="font-semibold">This Month Orders</h2>
                    <p>{salesData.thisMonthOrders}</p>
                </div>

                <div className="rounded  p-4">
                    <h2 className="font-semibold">Total Revenue</h2>
                    <p>${salesData.totalRevenue}</p>
                </div>
                <div className="rounded  p-4">
                    <h2 className="font-semibold">Today's Revenue</h2>
                    <p>${salesData.todayRevenue}</p>
                </div>
                <div className="rounded  p-4">
                    <h2 className="font-semibold">This Month Revenue</h2>
                    <p>${salesData.thisMonthRevenue}</p>
                </div>
            </div>

            <h2 className="mb-2 text-xl font-bold">Orders by Status</h2>
            <div className="mb-8 grid grid-cols-5 gap-4">
                {[
                    'pending',
                    'processing',
                    'shipped',
                    'delivered',
                    'cancelled',
                ].map((status) => (
                    <div key={status} className="rounded  p-4">
                        <h3 className="font-semibold capitalize">{status}</h3>
                        <p>{salesData[`${status}Orders`]}</p>
                    </div>
                ))}
            </div>

            <h2 className="mb-2 text-xl font-bold">Recent Orders</h2>
            <table className="min-w-full border ">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Order ID</th>
                        <th className="border px-4 py-2">User</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Total</th>
                        <th className="border px-4 py-2">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.recentOrders.map((order) => (
                        <tr key={order.id}>
                            <td className="border px-4 py-2">{order.id}</td>
                            <td className="border px-4 py-2">
                                {order.user.name}
                            </td>
                            <td className="border px-4 py-2">{order.status}</td>
                            <td className="border px-4 py-2">${order.total}</td>
                            <td className="border px-4 py-2">
                                {new Date(order.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}

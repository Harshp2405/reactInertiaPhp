import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ orders }) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Orders</h1>
                <table className="w-full table-auto border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">User</th>
                            <th className="border p-2">Total</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.map((order) => (
                            <tr key={order.id} className="text-gray-200">
                                <td className="border p-2">{order.id}</td>
                                <td className="border p-2">
                                    {order.user.name}
                                </td>
                                <td className="border p-2">₹ {order.total}</td>
                                <td className="border p-2">{order.status}</td>
                                <td className="border p-2">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

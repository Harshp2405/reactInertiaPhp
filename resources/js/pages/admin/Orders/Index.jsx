import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ orders }) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl p-6">
                <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-white">
                    Orders
                </h1>

                <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-400 uppercase"
                                >
                                    Order ID
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-400 uppercase"
                                >
                                    User
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-400 uppercase"
                                >
                                    Total (₹)
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-400 uppercase"
                                >
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">View</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-800 bg-gray-950">
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="transition-colors duration-200 hover:bg-gray-800"
                                >
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                        {order.user.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                        ₹ {Number(order.total).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                {
                                                    pending:
                                                        'bg-yellow-500/20 text-yellow-400',
                                                    processing:
                                                        'bg-blue-500/20 text-blue-400',
                                                    shipped:
                                                        'bg-indigo-500/20 text-indigo-400',
                                                    delivered:
                                                        'bg-green-500/20 text-green-400',
                                                    cancelled:
                                                        'bg-red-500/20 text-red-400',
                                                }[order.status] ||
                                                'bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            {order.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-indigo-400 transition-colors hover:text-indigo-600"
                                        >
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

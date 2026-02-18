import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [{ title: 'Orders', href: '/orders' }];

export default function OrdersIndex({ orders }) {
    const statusStyles = {
        pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
        cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl px-6 py-10">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            My Orders
                        </h1>
                        <p className="mt-1 text-sm text-gray-400">
                            Track and manage your recent purchases
                        </p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-linear-to-br from-gray-950 to-gray-900 py-16 text-center shadow-lg">
                        <div className="mb-4 rounded-full bg-gray-800 p-4">
                            📦
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            No Orders Yet
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Looks like you haven’t placed any orders.
                        </p>
                        <Link
                            href="/Products"
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="group flex flex-col gap-6 rounded-2xl border border-gray-800 bg-linear-to-br from-gray-950 to-gray-900 p-6 shadow-md transition-all duration-300 hover:border-gray-600 hover:shadow-2xl sm:flex-row sm:items-center sm:justify-between"
                            >
                                {/* Left */}
                                <div>
                                    <p className="text-lg font-semibold text-white">
                                        Order #{order.id}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleString()}
                                    </p>

                                    <span
                                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                            statusStyles[order.status] ||
                                            'border border-gray-700 bg-gray-500/10 text-gray-400'
                                        }`}
                                    >
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1)}
                                    </span>
                                </div>

                                {/* Right */}
                                <div className="flex flex-col items-start gap-3 sm:items-end">
                                    <p className="text-2xl font-bold text-white">
                                        ₹ {Number(order.total).toFixed(2)}
                                    </p>

                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 active:scale-95"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

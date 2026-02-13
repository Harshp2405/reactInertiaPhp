import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [{ title: 'Orders', href: '/orders' }];

export default function OrdersIndex({ orders }) {

    const statusColors = {
        pending: 'bg-yellow-500/10 text-yellow-400',
        completed: 'bg-green-500/10 text-green-400',
        cancelled: 'bg-red-500/10 text-red-400',
    };
      

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl p-6">
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="rounded-xl border border-gray-800 bg-gray-950 p-8 text-center">
                        <p className="text-lg text-gray-400">
                            You have no orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="group flex items-center justify-between rounded-2xl border border-gray-800 bg-linear-to-br from-gray-950 to-gray-900 p-6 shadow-md transition-all duration-300 hover:border-gray-600 hover:shadow-xl"
                            >
                                {/* Left Side */}
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
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            statusColors[order.status] ||
                                            'bg-gray-500/10 text-gray-400'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                {/* Right Side */}
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-white">
                                        ₹ {Number(order.total).toFixed(2)}
                                    </p>

                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="mt-3 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
                                    >
                                        View Details
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

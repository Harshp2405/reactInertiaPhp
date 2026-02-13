import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Show() {
    const { user } = usePage().props;
console.log(user)


    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      completed: "bg-green-500/20 text-green-400 border-green-500",
      cancelled: "bg-red-500/20 text-red-400 border-red-500",
      shipped: "bg-blue-500/20 text-blue-400 border-blue-500",
    };


    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
            <Link
                    href="/admin/users"
                    className="mb-5 inline-block text-sm text-blue-400 hover:underline"
                >
                    ← Back to User
                </Link>
                {/* User Header */}
                <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
                    <h1 className="mb-2 text-2xl font-bold">👤 {user.name}</h1>
                    <p className="text-gray-400">{user.email}</p>
                    <span className="mt-3 inline-block rounded-full border border-indigo-500 bg-indigo-600/20 px-3 py-1 text-sm text-indigo-400">
                        Total Orders: {user.orders.length}
                    </span>
                </div>

                {/* Orders */}
                <div className="space-6  ">
                <div className="grid grid-cols-3 gap-6 ">
                    {user.orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl transition hover:border-indigo-500"
                        >
                            {/* Order Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Order #{order.id}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full border px-3 py-1 text-sm ${
                                        styles[order.status] ||
                                        'border-gray-600 bg-gray-700 text-gray-300'
                                    }`}
                                >
                                    {order.status.toUpperCase()}
                                </span>
                            </div>

                            {/* 🔥 Shipping Address */}
                            <div className="mb-6 rounded-xl border border-gray-800 bg-gray-950 p-4">
                                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                    Shipping Address
                                </h3>

                                <div className="space-y-1 text-sm text-gray-300">
                                    <p>{order.address_line1}</p>

                                    {order.address_line2 && (
                                        <p className="text-gray-400">
                                            {order.address_line2}
                                        </p>
                                    )}

                                    <p>
                                        {order.city}, {order.state}
                                    </p>

                                    <p>{order.postal_code}</p>

                                    <p className="text-gray-400">
                                        {order.country}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-800">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between py-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Qty: {item.quantity} - $
                                                {item.price}
                                            </p>
                                        </div>

                                        <div className="font-semibold text-indigo-400">
                                            ${item.total}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 space-y-1 border-t border-gray-800 pt-4 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span>${order.tax}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>${order.shipping}</span>
                                </div>
                                <div className="flex justify-between pt-2 text-lg font-semibold text-white">
                                    <span>Total</span>
                                    <span>${order.total}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </AppLayout>
    );
}

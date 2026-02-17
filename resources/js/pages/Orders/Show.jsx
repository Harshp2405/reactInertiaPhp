import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';



const breadcrumbs = [{ title: 'Orders Details', href: `/orders` }];


export default function Show({ order }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-6xl p-6">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => router.get('/orders')}
                    className="mb-6 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition hover:bg-gray-700 active:scale-95"
                >
                    ← Back to Orders
                </button>

                <button
                    type="button"
                    onClick={() =>
                        window.open(`/orders/${order.id}/invoice`, '_blank')
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
                >
                    Download Invoice (PDF)
                </button>

                {/* Header */}
                <div className="mb-6 rounded-2xl border border-gray-800 bg-linear-to-br from-gray-950 to-gray-900 p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Order #{order.id}
                            </h1>
                            <p className="mt-1 text-sm text-gray-400">
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>

                        <span className="rounded-full bg-green-500/10 px-4 py-1 text-sm font-medium text-green-400">
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* ======= Items ======= */}
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Items
                    </h2>

                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-600"
                            >
                                <div className="flex items-center gap-4">
                                    {item.product.images?.[0] && (
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="h-20 w-20 rounded-lg object-cover"
                                        />
                                    )}

                                    <div>
                                        <p className="font-semibold text-white">
                                            {item.product.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            ₹ {Number(item.price).toFixed(2)} ×{' '}
                                            {item.quantity}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-lg font-bold text-white">
                                    ₹ {Number(item.total).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ======= Bottom Section ======= */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Shipping Address */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Shipping Address
                        </h2>
                        <div className="space-y-1 text-gray-400">
                            <p>{order.address_line1}</p>
                            {order.address_line2 && (
                                <p>{order.address_line2}</p>
                            )}
                            <p>
                                {order.city}, {order.state} -{' '}
                                {order.postal_code}
                            </p>
                            <p>{order.country}</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Order Summary
                        </h2>

                        <div className="space-y-3 text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                    ₹ {Number(order.subtotal).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹ {Number(order.tax).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    ₹ {Number(order.shipping).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-gray-800 pt-4 text-lg font-bold text-white">
                                <span>Total</span>
                                <span>₹ {Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

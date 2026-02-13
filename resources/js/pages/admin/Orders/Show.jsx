import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ShowOrder() {
    const { order:initialOrder } = usePage().props;
    const [order, setOrder] = useState(initialOrder);
    const statusStyles = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
        processing: 'bg-orange-500/20 text-orange-400 border-orange-500',
        shipped: 'bg-blue-500/20 text-blue-400 border-blue-500',
        delivered: 'bg-green-500/20 text-green-400 border-green-500',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500',
    };

    const updateStatus = async (status) => {
        await router.put(
            `/admin/orders/${order.id}`,
            { status },
            {
                preserveScroll: true,
                onSuccess: () => console.log('Status updated'),
                onError: (err) => console.error(err),
            },
        );
    };

    const handleChange = (e) => {
        const newStatus = e.target.value;
        updateStatus(newStatus);
        setOrder({ ...order, status: newStatus }); 
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
                <Link
                    href="/admin/orders"
                    className="mb-5 inline-block text-sm text-blue-400 hover:underline"
                >
                    ← Back to Orders
                </Link>

                {/* Order Header */}
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Order #{order.id}
                        </h1>
                        <p className="text-gray-400">
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>

                    {/* Status Dropdown */}
                    <select
                        value={order.status}
                        onChange={handleChange}
                        className={`rounded border px-3 py-2 font-semibold ${statusStyles[order.status]}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Shipping Address */}
                <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Shipping Address
                    </h2>
                    <div className="space-y-1 text-sm text-gray-400">
                        <p>{order.address_line1}</p>
                        {order.address_line2 && <p>{order.address_line2}</p>}
                        <p>
                            {order.city}, {order.state} - {order.postal_code}
                        </p>
                        <p>{order.country}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Items
                    </h2>
                    <div className="divide-y divide-gray-800">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between py-4"
                            >
                                <div className="flex items-center gap-4">
                                    {item.product?.images?.[0] && (
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {item.product?.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Qty: {item.quantity} × ₹{' '}
                                            {Number(item.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="font-semibold text-white">
                                    ₹ {Number(item.total)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Order Summary
                    </h2>
                    <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹ {Number(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹ {Number(order.tax)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹ {Number(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-800 pt-2 text-lg font-bold text-white">
                            <span>Total</span>
                            <span>₹ {Number(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

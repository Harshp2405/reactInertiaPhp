import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast'

const breadcrumbs = [
    { title: 'Order Details', href: '#' },
];

export default function Show() {
    const { order: initialOrder, user } = usePage().props;

    const [order, setOrder] = useState(initialOrder);
    const statusStyles = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
        processing: 'bg-orange-500/20 text-orange-400 border-orange-500',
        shipped: 'bg-blue-500/20 text-blue-400 border-blue-500',
        delivered: 'bg-green-500/20 text-green-400 border-green-500',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500',
    };

    const updateStatus =  (status) => {
        router.put(
            `/ordermanager/order/${order.id}`,
            { status },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Status updated'),
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Link
                href="/ordermanager/dashboard"
                className="mb-5 inline-block text-sm text-blue-400 hover:underline"
            >
                ← Back to Orders
            </Link>
            <Head title={`Order #${order.id}`} />

            <div className="space-y-8 p-6">
                {/* ================= Order Header ================= */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                    {user.permissions.can_edit === true && (
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
                    )}
                </div>

                {/* ================= Order Summary ================= */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Customer Info */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
                        <h2 className="mb-3 font-semibold">Customer Info</h2>
                        <p>
                            <strong>Name:</strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {order.user.email}
                        </p>
                        <p>
                            <strong>Wallet:</strong> {order.user.Wallet}
                        </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
                        <h2 className="mb-3 font-semibold">Shipping Address</h2>
                        <p>{order.address_line1}</p>
                        <p>{order.address_line2}</p>
                        <p>
                            {order.city}, {order.state}
                        </p>
                        <p>{order.country}</p>
                        <p>{order.postal_code}</p>
                    </div>

                    {/* Payment Summary */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
                        <h2 className="mb-3 font-semibold">Order Summary</h2>
                        <p>Subtotal: ${order.subtotal}</p>
                        <p>Tax: ${order.tax}</p>
                        <p>Shipping: ${order.shipping}</p>
                        <hr className="my-2" />
                        <p className="text-lg font-bold">
                            Total: ${order.total}
                        </p>
                    </div>
                </div>

                {/* ================= Order Items ================= */}
                <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
                    <h2 className="mb-4 font-semibold">Order Items</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3 text-left">Product</th>
                                    <th className="p-3 text-left">Price</th>
                                    <th className="p-3 text-left">Qty</th>
                                    <th className="p-3 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-3">
                                            {item.product.name}
                                        </td>
                                        <td className="p-3">${item.price}</td>
                                        <td className="p-3">{item.quantity}</td>
                                        <td className="p-3">${item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

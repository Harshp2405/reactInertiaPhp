import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import toast from 'react-hot-toast'
export default function Show() {
    const { user } = usePage().props;



    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      completed: "bg-green-500/20 text-green-400 border-green-500",
      cancelled: "bg-red-500/20 text-red-400 border-red-500",
      shipped: "bg-blue-500/20 text-blue-400 border-blue-500",
    };

    const roleNames = {
        0: 'Super Admin',
        1: 'User',
        2: 'Product Manager',
        3: 'Order Manager',
        4: 'Customer Support',
        5: 'Accountant',
    };


    const roleOptions = [
        { value: 0, label: 'Super Admin' },
        { value: 1, label: 'User' },
        { value: 2, label: 'Product Manager' },
        { value: 3, label: 'Order Manager' },
        { value: 4, label: 'Customer Support' },
        { value: 5, label: 'Accountant' },
    ];

    const [selectedRole, setSelectedRole] = useState(user.role);
    const [permissions, setPermissions] = useState(
        user.permissions || {
            can_edit: false,
            can_add: false,
            can_delete: false,
            can_view: true,
        },
    );

    const handlePermissionChange = (e) => {
        const { name, checked } = e.target;
        setPermissions((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };
    

    const handleRoleChange = (e) => {
        const value = Number(e.target.value);
        setSelectedRole(value);
        console.log(value); // logs the new value immediately
    };
    

    const handleUpdateRole = () => {
        router.put(
            `/admin/users/${user.id}`,
            { role: selectedRole, permissions: permissions },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast.success('Role updated successfully!');
                    console.log(page.props.user); // updated user from backend
                },
                onError: (errors) => console.error(errors),
            },
        );
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
                        Total Orders: {user.orders?.length ?? 0}
                    </span>
                    <span className="mx-5 mt-3 inline-block rounded-full border border-indigo-500 bg-indigo-600/20 px-3 py-1 text-sm text-indigo-400">
                        Role: {roleNames[user.role] || user.role}
                    </span>
                </div>

                {/* Permissions and role */}

                <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
                    {/* Role Selection */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <label className="font-medium text-gray-300">
                                Role:
                            </label>
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {roleOptions.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleUpdateRole}
                            className="rounded bg-indigo-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-indigo-500"
                        >
                            Update Role & Permissions
                        </button>
                    </div>

                    {/* Permissions */}
                    {user.role !== 1 && (
                        <div className="mt-6">
                            <h3 className="mb-3 font-semibold text-gray-300">
                                Permissions
                            </h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {Object.keys(permissions).map((perm) => (
                                    <label
                                        key={perm}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 transition hover:border-indigo-500"
                                    >
                                        <input
                                            type="checkbox"
                                            name={perm}
                                            checked={permissions[perm]}
                                            onChange={handlePermissionChange}
                                            className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="font-medium text-gray-200">
                                            {perm
                                                .replace('can_', '')
                                                .replace('_', ' ')
                                                .toUpperCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders */}
                <div className="space-6">
                    <div className="grid grid-cols-3 gap-6">
                        {user.orders?.map((order) => (
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
                        )) || <p className="text-gray-400">No orders found.</p>}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

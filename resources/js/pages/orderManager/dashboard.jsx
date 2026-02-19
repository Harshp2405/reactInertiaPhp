import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [{ title: 'Order Manager', href: '/dashboard' }];

export default function Dashboard({ orderData }) {
    const {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        cancelledOrders,
        thisMonthOrders,
        todayOrders,
        todayRevenue,
        recentOrders,
        deliveredOrders,
    } = orderData;
    // console.log(recentOrders);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order Manager Dashboard" />

            <div className="space-y-8 p-6">
                {/* ================= Stats Cards ================= */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <StatCard title="Total Orders" value={totalOrders} />
                    <StatCard
                        title="Pending Orders"
                        value={pendingOrders}
                        classname="bg-yellow-500/20 text-yellow-400 border-yellow-500"
                    />
                    <StatCard
                        classname="border-orange-500 bg-orange-500/20 text-orange-400"
                        title="Processing Orders"
                        value={processingOrders}
                    />
                    <StatCard
                        title="Shipped Orders"
                        classname="bg-blue-500/20 text-blue-400 border-blue-500"
                        value={shippedOrders}
                    />
                    <StatCard
                        classname="bg-green-500/20 text-green-400 border-green-500"
                        title="Delivered Orders"
                        value={deliveredOrders}
                    />
                    <StatCard
                        classname="bg-red-500/20 text-red-400 border-red-500"
                        title="Cancelled Orders"
                        value={cancelledOrders}
                    />
                    <StatCard
                        title="This Month Orders"
                        value={thisMonthOrders}
                    />
                    <StatCard title="Today Orders" value={todayOrders} />
                    <StatCard
                        title="Today Revenue"
                        value={`$${todayRevenue}`}
                    />
                </div>

                {/* ================= Recent Orders ================= */}
                <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
                    <h2 className="mb-4 text-lg font-semibold">
                        Recent Orders
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3 text-left">Order ID</th>
                                    <th className="p-3 text-left">Customer</th>
                                    <th className="p-3 text-left">Total</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="p-3">#{order.id}</td>
                                        <td className="p-3">
                                            {order.user?.name}
                                        </td>
                                        <td className="p-3">${order.total}</td>
                                        <td className="p-3">
                                            <StatusBadge
                                                status={order.status}
                                            />
                                        </td>
                                        <td className="p-3">
                                            {order.created_at
                                                .split('T')[0]
                                                .split('-')
                                                .reverse()
                                                .join('-')}
                                        </td>
                                        <td className="p-3">
                                            <Link
                                                href={`/ordermanager/order/${order.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {recentOrders.length === 0 && (
                            <p className="py-6 text-center text-gray-500">
                                No recent orders found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ================= Components ================= */

function StatCard({
    title,
    value,
    classname = ' bg-white dark:bg-gray-900',
}) {
    return (
        <div className={`rounded-xl p-4 shadow ${classname}`}>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="mt-2 text-2xl font-bold">{value}</h3>
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
        processing: 'bg-orange-500/20 text-orange-400 border-orange-500',
        shipped: 'bg-blue-500/20 text-blue-400 border-blue-500',
        delivered: 'bg-green-500/20 text-green-400 border-green-500',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500',
    };

    return (
        <span
            className={`rounded-full px-2 py-1 text-xs ${colors[status] || 'bg-gray-100'}`}
        >
            {status}
        </span>
    );
}

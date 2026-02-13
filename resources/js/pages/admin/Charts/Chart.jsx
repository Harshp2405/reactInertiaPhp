import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import StatChart from './StatChart';

export default function Chart({ stats }) {
    // Example: sales trend over last 7 days
    // const salesLabels = stats.SalesByDate.map((item) => item.date);
    const salesLabels = stats.SalesByDate.map((item) =>
        item.date.split('-').reverse().join('-').split('-', 2).join('-'),
    );
    const salesData = stats.SalesByDate.map((item) => parseFloat(item.total));
    
    const month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const salesLabelsbyMonth = stats.SalesbyMonth.map((item) => month[item.month - 1]);
    const salesDataByMonth = stats.SalesbyMonth.map((item) => parseFloat(item.total));



    // console.log(stats.SalesByDate.map((item) => item.date.split('-').reverse().join('-').split('-',2).join('-')));


    // Example: orders per status
    const orderLabels = [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
    ];
    const orderData = [
        stats.pandingOrders,
        stats.ProcessingOrders,
        stats.ShippedOrders,
        stats.DeliveredOrders,
        stats.CancelledOrders,
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <h2 className="mb-2 font-bold">Sales This Week</h2>
                    <StatChart
                        labels={salesLabels}
                        data={salesData}
                        label="Sales (₹)"
                    />
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-2 font-bold">Sales By Month</h2>
                    <StatChart
                        labels={salesLabelsbyMonth}
                        data={salesDataByMonth}
                        label="Sales (₹)"
                    />
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-2 font-bold">Orders by Status</h2>
                    <StatChart
                        labels={orderLabels}
                        data={orderData}
                        label="Orders"
                        borderColor="rgb(255,99,132)"
                    />
                </div>
            </div>
        </>
    );
}

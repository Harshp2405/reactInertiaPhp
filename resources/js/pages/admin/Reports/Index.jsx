import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function ReportsIndex() {
    const { reports, users, filters } = usePage().props;
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [userFilter, setUserFilter] = useState(filters.user_id || '');
    const [order, setOrder] = useState(reports.status);





    const filterReports = () => {
        router.get(
            '/admin/reports',
            { type: typeFilter, user_id: userFilter },
            { preserveState: true },
        );
    };

    const updateStatus = (reportId, status) => {
        router.post(
            `/admin/reports/${reportId}/resolve`, // <-- reportId, not status
            { status },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Status updated'),
                onError: (err) => console.error(err),
            },
        );
    };
    
        const handleChange = (reportId, e) => {
            const newStatus = e.target.value;
            updateStatus(reportId, newStatus);

            setOrder((prev) => ({
                ...prev,
                status: newStatus,
            }));
        };


        useEffect(() => {
            console.log('Echo:', window.Echo);

            window.Echo.channel('reports').listen('.report.created', (e) => {
                console.log('EVENT RECEIVED:', e);
                toast.success('New Report Received');
            });
        }, []);

    return (
        <AppLayout>
            <h1 className="mb-4 text-2xl font-bold">Reports Dashboard</h1>

            {/* Filters */}
            <div className="mb-4 flex gap-4">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded border bg-black p-2"
                >
                    <option value="">All Types</option>
                    <option value="delivery">Delivery</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="other">Other</option>
                </select>

                <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="rounded border p-2"
                >
                    <option value="">All Users</option>
                    {users.map((user) => (
                        <option
                            key={user.id}
                            value={user.id}
                            className="bg-black"
                        >
                            {user.name}
                        </option>
                    ))}
                </select>

                <Button onClick={filterReports}>Filter</Button>
            </div>

            {/* Reports Table */}
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">User</th>
                        <th className="border px-4 py-2">Type</th>
                        <th className="border px-4 py-2">Message</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.data.map((report) => (
                        <tr key={report.id}>
                            <td className="border px-4 py-2">{report.id}</td>
                            <td className="border px-4 py-2">
                                {report.user.name}
                            </td>
                            <td className="border px-4 py-2">{report.type}</td>
                            <td className="border px-4 py-2">
                                {report.message}
                            </td>
                            <td className="border px-4 py-2">
                                {report.status}
                            </td>
                            <td className="border px-4 py-2">
                                {
                                    <select
                                        value={report.status}
                                        onChange={(e) =>
                                            handleChange(report.id, e)
                                        }
                                        className="rounded border bg-black px-3 py-2 font-semibold"
                                    >
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                        <option value="processing">
                                            Processing
                                        </option>
                                        <option value="onProcess">
                                            On Process
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="open">Open</option>
                                    </select>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {/* Pagination */}
            <div className="mt-4 flex gap-2">
                {reports.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        className={`rounded border px-3 py-1 ${link.active ? 'bg-blue-500' : 'bg-black'}`}
                        onClick={() => link.url && router.get(link.url)}
                    >
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </button>
                ))}
            </div>
        </AppLayout>
    );
}

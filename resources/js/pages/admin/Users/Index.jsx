import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '@/layouts/app-layout';

export default function Index() {
    const { users } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('User deleted');
                },
            });
        }
    };
    
    // console.log(users , "_______________________________Users_______________________________")

    const roleNames = {
        0:'Super Admin',
        1: 'User',
        2: 'Product Manager',
        3: 'Order Manager',
        4: 'Customer Support',
        5: 'Accountant',
    };



    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Users List</h1>

                <table className="min-w-full border">
                    <thead>
                        <tr className="">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">{user.id}</td>
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    {roleNames[user.role] || users.role}
                                </td>
                                <td className="space-x-2 border p-2">
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="rounded-md bg-slate-600 px-3 py-1.5 text-center text-sm text-white hover:bg-slate-700"
                                    >
                                        Details
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-center space-x-2">
                    {users.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded px-3 py-1 ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-black'
                                }`}
                                preserveScroll
                            />
                        ) : (
                            <span
                                key={index}
                                className="rounded px-3 py-1 text-gray-500"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

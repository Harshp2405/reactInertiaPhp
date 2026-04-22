import React from 'react';
import AppLayout from '@/layouts/app-layout';
import SortableProductCard from '../Products/SortableProductCard';
import { Head, router, useForm, usePage } from '@inertiajs/react';

const breadcrumbs = [{ title: 'My Products', href: '/myproducts' }];
export default function Index({ Data  , User}) {
    console.log(Data, ' Data --------------');
    console.log(User, ' User --------------');
    const { processing, errors } = useForm();
    const handleDelete = (id) => {
        if (confirm('Are you sure to delete?')) {
            router.delete(`/Products/${id}`, {
                onSuccess: () => {
                    // setItems((prev) => prev.filter((item) => item.id !== id));
                    toast.success('Product deleted');
                },
                onError: (errors) => {
                    console.log(errors);
                    toast.error(errors.error || 'Delete failed');
                },
            });
        }
    };
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                {Data.map((dt) =>
                    dt.quantity > 20 ? (
                        <SortableProductCard
                            key={dt.id}
                            dt={dt}
                            processing={processing}
                            onDelete={handleDelete}
                            User={User}
                        />
                    ) : (
                        <div className="relative">
                            <p className="absolute top-75 left-25 z-5 text-xl font-bold text-red-500">
                                Out of stock
                            </p>
                            <div className="disabled text-xl font-bold opacity-50">
                                <SortableProductCard
                                    key={dt.id}
                                    dt={dt}
                                    processing={processing}
                                    onDelete={handleDelete}
                                    User={User}
                                />
                            </div>
                        </div>
                    ),
                )}
            </AppLayout>
        </>
    );
}

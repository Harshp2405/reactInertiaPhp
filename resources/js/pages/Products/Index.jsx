
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '../../components/ui/button';
import SortableProductCard from './SortableProductCard';

import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const breadcrumbs = [{ title: 'Products', href: '/Products' }];

export default function Index({ Data, User, categories }) {
    const {
        Data: initialData,
        filters: initialFilters = {},
        flash = {},
    } = usePage().props;



    const [filters, setFilters] = useState({
        search: initialFilters?.search ?? '',
        category: initialFilters?.category ?? '',
        min_price: initialFilters?.min_price ?? '',
        max_price: initialFilters?.max_price ?? '',
    });

    const [items, setItems] = useState(initialData);

    // console.log(items, '---------------------Data----------------');
    // console.log(User, '---------------------Data----------------');
    const { processing } = useForm();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setItems((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id);
            const newIndex = prev.findIndex((i) => i.id === over.id);

            const newOrder = arrayMove(prev, oldIndex, newIndex);

            return newOrder;
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure to delete?')) {
            router.delete(`/Products/${id}`, {
                onSuccess: () => {
                    setItems((prev) => prev.filter((item) => item.id !== id));
                    toast.success ('Product deleted');
                },
            });
        }
    };

    const handleFilterChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value,
        };

        setFilters(newFilters);
        const filtered = Object.fromEntries(
            Object.entries(newFilters).filter(([_, v]) => v !== ''),
        );
        router.get('/Products', filtered, {
            preserveState: true,
            replace: true,
        });
    };

    useEffect(() => {
        setItems(initialData);
    }, [initialData]);

    // console.log(initialData,"===============================initialData==================================");

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                {/* <h2>Welcome Admin {User.name}</h2> */}
                {console.log(User)}
                {User.name}
                <div className="m-4">
                    <Button onClick={() => router.get('/Products/create')}>
                        Sell Products
                    </Button>
                </div>

                <Head title="Products" />

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="mb-4 rounded p-4">
                            <div className="grid grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search..."
                                    value={filters.search ?? ''}
                                    onChange={handleFilterChange}
                                    className="rounded border p-2"
                                />

                                <select
                                    name="category"
                                    value={filters.category ?? ''}
                                    onChange={handleFilterChange}
                                    className="rounded border bg-slate-600 p-2"
                                >
                                    <option value="">All Categories</option>
                                    {/* <option value="1">Electronics</option>
                                    <option value="2">Mobiles</option>
                                    <option value="3">Laptops</option> */}
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    name="min_price"
                                    placeholder="Min Price"
                                    value={filters.min_price ?? ''}
                                    onChange={handleFilterChange}
                                    className="rounded border p-2"
                                />

                                <input
                                    type="number"
                                    name="max_price"
                                    placeholder="Max Price"
                                    value={filters.max_price ?? ''}
                                    onChange={handleFilterChange}
                                    className="rounded border p-2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {items
                                .filter((item) => item.price !== '0.00')
                                .map((dt) =>
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
                        </div>
                    </SortableContext>
                </DndContext>
            </AppLayout>
        </>
    );
}

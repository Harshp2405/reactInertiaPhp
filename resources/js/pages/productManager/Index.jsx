import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SortableProductCard from './SortableProductCard';
import { Button } from '../../components/ui/button';

const breadcrumbs = [{ title: 'Product', href: '/productmanager/product' }];

export default function Index({ Data, User, categories, processing }) {
    const { Data: initialData, filters: initialFilters = {} } = usePage().props;

    const [filters, setFilters] = useState({
        search: initialFilters?.search ?? '',
        category: initialFilters?.category ?? '',
        min_price: initialFilters?.min_price ?? '',
        max_price: initialFilters?.max_price ?? '',
    });

    const [allItems, setAllItems] = useState(initialData); // all product
    const [filteredItems, setFilteredItems] = useState(initialData); // filtered product

    // Update allItems when initialData changes
    useEffect(() => {
        setAllItems(initialData);
    }, [initialData]);

    // Filter allItems whenever filters or allItems change
    useEffect(() => {
        let filtered = allItems;

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchLower),
            );
        }

        if (filters.category) {
            filtered = filtered.filter(
                (item) => item.category_id === Number(filters.category),
            );
        }

        if (filters.min_price) {
            filtered = filtered.filter(
                (item) => Number(item.price) >= Number(filters.min_price),
            );
        }

        if (filters.max_price) {
            filtered = filtered.filter(
                (item) => Number(item.price) <= Number(filters.max_price),
            );
        }

        setFilteredItems(filtered);
    }, [filters, allItems]);

    const handleFilterChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const { data, setData, post } = useForm({
        csv_file: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('csv_file', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/productmanager/product/upload-csv', {
            forceFormData: true,
            onSuccess: () => {
                console.log('CSV uploaded successfully');
                setData('csv_file', null);
            },
            onError: (errors) => {
                console.log(errors);
                alert('Error uploading CSV');
            },
        });
        console.log(data, ' data ');
    };

    const handleDelete = (productId) => {
        router.delete(`/productmanager/product/${productId}`, {
            preserveScroll: true,
            onSuccess: () => console.log('Deleted'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={handleSubmit} className="m-4">
                <label
                    htmlFor="csv-upload"
                    className="mb-2 block text-sm text-gray-700"
                >
                    Upload CSV File
                </label>
                <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mb-4"
                />
                <div>
                    {data.csv_file == null ? (
                        <button
                            type="submit"
                            disabled
                            className="rounded-md bg-red-500 px-4 py-2 text-white"
                        >
                            Choose File to upload
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="rounded-md bg-blue-500 px-4 py-2 text-white"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>

            <div className="m-4">
                <Button onClick={() => router.get('/productmanager/product/create')}>
                    Create Product
                </Button>
            </div>

            {/* ...filters UI */}
            <div className="m-4 grid grid-cols-4 gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="rounded border p-2"
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="rounded border bg-slate-600 p-2"
                >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="min_price"
                    placeholder="Min Price"
                    value={filters.min_price}
                    onChange={handleFilterChange}
                    className="rounded border p-2"
                />
                <input
                    type="number"
                    name="max_price"
                    placeholder="Max Price"
                    value={filters.max_price}
                    onChange={handleFilterChange}
                    className="rounded border p-2"
                />
            </div>

            {/* Render filteredItems here */}
            <div className="grid grid-cols-4 gap-4">
                {filteredItems
                    .filter((item) => item.price !== '0.00')
                    .map((dt) => (
                        <SortableProductCard
                            key={dt.id}
                            dt={dt}
                            processing={processing}
                            onDelete={() => {
                                handleDelete(dt.id);
                            }}
                            User={User}
                        />
                    ))}
            </div>
        </AppLayout>
    );
}

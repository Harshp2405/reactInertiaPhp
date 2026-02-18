import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
export default function Dashboard() {
    const { productData } = usePage().props;
    console.log(productData);
    const {
        categories = [],
        subCategories = [],
        Data: allProducts = [],
        lowStockProducts = [],
        BestsellingProducts = [],
    } = productData;

    return (
        <AppLayout>
            <div className="min-h-screen space-y-10 bg-gray-950 p-6 text-white">
                {/* ================= HEADER ================= */}
                <h1 className="text-3xl font-bold">
                    📊 Product Manager Dashboard
                </h1>

                {/* ================= STATS ================= */}
                <div className="grid grid-cols-4 gap-6">
                    <StatCard
                        title="Main Categories"
                        value={categories.length}
                    />

                    <StatCard
                        title="Sub Categories"
                        value={subCategories.length}
                    />

                    <StatCard
                        title="Total Products"
                        value={allProducts.length}
                    />

                    <StatCard
                        title="Low Stock"
                        value={lowStockProducts.length}
                        danger
                    />
                </div>

                {/* ================= CATEGORY OVERVIEW ================= */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        🗂 Categories Overview
                    </h2>

                    <div className="grid grid-cols-3 gap-6">
                        {categories.map((cat) => {
                            // Get subcategories of this main category
                            const subCats = subCategories.filter(
                                (sub) => sub.parent_id === cat.id,
                            );

                            const subCatIds = subCats.map((sub) => sub.id);

                            // Get products under those subcategories
                            const catProducts = allProducts.filter(
                                (p) =>
                                    p.is_parent === 0 &&
                                    subCatIds.includes(p.parent_id),
                            );

                            // Total stock
                            const totalStock = catProducts.reduce(
                                (sum, p) => sum + Number(p.quantity || 0),
                                0,
                            );

                            // Total sales
                            const totalSales =
                                BestsellingProducts?.filter(
                                    (bp) =>
                                        bp.product &&
                                        subCatIds.includes(
                                            bp.product.parent_id,
                                        ),
                                ).reduce(
                                    (sum, bp) => sum + Number(bp.count || 0),
                                    0,
                                ) ?? 0;

                            return (
                                <div
                                    key={cat.id}
                                    className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition hover:border-indigo-500"
                                >
                                    <h3 className="text-lg font-bold">
                                        {cat.name}
                                    </h3>

                                    <div className="mt-3 space-y-1 text-sm text-gray-400">
                                        <p>Subcategories: {subCats.length}</p>
                                        <p>Products: {catProducts.length}</p>
                                        <p>Total Stock: {totalStock}</p>
                                        <p className="font-semibold text-indigo-400">
                                            Total Sales: {totalSales}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ================= BESTSELLING PRODUCTS ================= */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        🔥 Bestselling Products
                    </h2>

                    <div className="grid grid-cols-4 gap-6">
                        {BestsellingProducts?.length ? (
                            BestsellingProducts.map((item) => {
                                if (!item.product) return null;

                                return (
                                    <div
                                        key={item.product_id}
                                        className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-indigo-500"
                                    >
                                        <h3 className="font-semibold">
                                            {item.product?.name || 'Unknown'}
                                        </h3>

                                        <div className="mt-2 space-y-1 text-sm text-gray-400">
                                            <p>Sold: {item.count}</p>
                                            <p>
                                                Price: $
                                                {item.product?.price ?? 0}
                                            </p>
                                            <p>
                                                Stock:{' '}
                                                {item.product?.quantity ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">
                                No bestselling products yet.
                            </p>
                        )}
                    </div>
                </section>

                {/* ================= LOW STOCK ================= */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-red-400">
                        ⚠ Low Stock Products
                    </h2>

                    <div className="grid grid-cols-4 gap-6">
                        {lowStockProducts.map((product) => (
                            <div
                                key={product.id}
                                className="rounded-lg border border-red-500 bg-gray-900 p-4"
                            >
                                <h3 className="font-semibold">
                                    {product.name}
                                </h3>

                                <p className="text-sm text-red-400">
                                    Stock: {product.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= PRODUCT LIST ================= */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        📦 All Products
                    </h2>

                    <div className="space-y-3">
                        {allProducts
                            .filter((d) => d.price !== '0.00')
                            .map((p) => {
                                const subCat = subCategories.find(
                                    (sub) => sub.id === p.parent_id,
                                );

                                const mainCat = categories.find(
                                    (c) => c.id === subCat?.parent_id,
                                );

                                return (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4"
                                    >
                                        <div>
                                            <h3 className="font-semibold">
                                                {p.name}
                                            </h3>

                                            <p className="text-sm text-gray-400">
                                                {mainCat?.name || '-'} /{' '}
                                                {subCat?.name || '-'}
                                            </p>
                                        </div>

                                        <div className="text-right text-sm">
                                            <p>${p.price}</p>
                                            <p>Stock: {p.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

/* ================= STAT CARD COMPONENT ================= */

function StatCard({ title, value, danger = false }) {
    return (
        <div
            className={`rounded-lg border p-6 ${
                danger
                    ? 'border-red-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900'
            }`}
        >
            <h3 className="text-sm text-gray-400">{title}</h3>
            <p
                className={`mt-2 text-2xl font-bold ${
                    danger ? 'text-red-400' : 'text-white'
                }`}
            >
                {value}
            </p>
        </div>
    );
}

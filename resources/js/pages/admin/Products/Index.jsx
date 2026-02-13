
// import { Head, router, useForm, usePage } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import { Button } from '../../../components/ui/button';
// import SortableProductCard from './SortableProductCard';

// import {
//     DndContext,
//     closestCenter,
//     PointerSensor,
//     TouchSensor,
//     useSensor,
//     useSensors,
// } from '@dnd-kit/core';

// import {
//     SortableContext,
//     verticalListSortingStrategy,
//     arrayMove,
// } from '@dnd-kit/sortable';

// import { useEffect, useState } from 'react';

// const breadcrumbs = [{ title: 'Products', href: '/admin/products' }];

// export default function Index({ Data, User, categories }) {
//     const {
//         Data: initialData,
//         filters: initialFilters = {},
//     } = usePage().props;

//     const [filters, setFilters] = useState({
//         search: initialFilters?.search ?? '',
//         category: initialFilters?.category ?? '',
//         min_price: initialFilters?.min_price ?? '',
//         max_price: initialFilters?.max_price ?? '',
//     });

//     const [items, setItems] = useState(initialData);

//     // console.log(items, '---------------------Data----------------');
//     // console.log(User, '---------------------Data----------------');
//     const { processing } = useForm();

//     const sensors = useSensors(
//         useSensor(PointerSensor),
//         useSensor(TouchSensor),
//     );

//     const handleDragEnd = (event) => {
//         const { active, over } = event;
//         if (!over || active.id === over.id) return;

//         setItems((prev) => {
//             const oldIndex = prev.findIndex((i) => i.id === active.id);
//             const newIndex = prev.findIndex((i) => i.id === over.id);

//             const newOrder = arrayMove(prev, oldIndex, newIndex);

//             return newOrder;
//         });
//     };

//     const handleDelete = (productId) => {
//         router.delete(`/admin/products/${productId}`, {
//             preserveScroll: true,
//             onSuccess: () => console.log('Deleted'),
//             onError: (err) => console.error(err),
//         });

//         // console.log(`/admin/products/${productId}`);
//     };

//     const handleFilterChange = (e) => {
//         const newFilters = {
//             ...filters,
//             [e.target.name]: e.target.value,
//         };

//         setFilters(newFilters);
//         const filtered = Object.fromEntries(
//             Object.entries(newFilters).filter(([_, v]) => v !== ''),
//         );
//         router.get('/admin/products', filtered, {
//             preserveState: true,
//             replace: true,
//         });
//     };

//     useEffect(() => {
//         setItems(initialData);
//     }, [initialData]);

//     // console.log(initialData,"===============================initialData==================================");

//     return (
//         <>
//             <AppLayout breadcrumbs={breadcrumbs}>

//                     <>{/* <h2>Welcome User {User.name}</h2> */}</>

 
//                     <>
//                         {/* <h2>Welcome Admin {User.name}</h2> */}
//                         <div className="m-4">
//                             <Button
//                                 onClick={() => router.get('/admin/products/create')}
//                             >
//                                 Create Product
//                             </Button>
//                         </div>
//                     </>

//                 <Head title="Products" />

//                 <DndContext
//                     sensors={sensors}
//                     collisionDetection={closestCenter}
//                     onDragEnd={handleDragEnd}
//                 >
//                     <SortableContext
//                         items={items.map((i) => i.id)}
//                         strategy={verticalListSortingStrategy}
//                     >
//                         <div className="mb-4 rounded p-4">
//                             <div className="grid grid-cols-4 gap-4">
//                                 <input
//                                     type="text"
//                                     name="search"
//                                     placeholder="Search..."
//                                     value={filters.search ?? ''}
//                                     onChange={handleFilterChange}
//                                     className="rounded border p-2"
//                                 />

//                                 <select
//                                     name="category"
//                                     value={filters.category ?? ''}
//                                     onChange={handleFilterChange}
//                                     className="rounded border bg-slate-600 p-2"
//                                 >
//                                     <option value="">All Categories</option>
//                                     {/* <option value="1">Electronics</option>
//                                     <option value="2">Mobiles</option>
//                                     <option value="3">Laptops</option> */}
//                                     {categories?.map((cat) => (
//                                         <option key={cat.id} value={cat.id}>
//                                             {cat.name}
//                                         </option>
//                                     ))}
//                                 </select>

//                                 <input
//                                     type="number"
//                                     name="min_price"
//                                     placeholder="Min Price"
//                                     value={filters.min_price ?? ''}
//                                     onChange={handleFilterChange}
//                                     className="rounded border p-2"
//                                 />

//                                 <input
//                                     type="number"
//                                     name="max_price"
//                                     placeholder="Max Price"
//                                     value={filters.max_price ?? ''}
//                                     onChange={handleFilterChange}
//                                     className="rounded border p-2"
//                                 />
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-6">
//                             {items
//                                 .filter((item) => item.price !== '0.00')
//                                 .map((dt) => (
//                                     <SortableProductCard
//                                         key={dt.id}
//                                         dt={dt}
//                                         processing={processing}
//                                         onDelete={()=>{handleDelete(dt.id);}}
//                                         User={User}
//                                     />
//                                 ))}
//                         </div>
//                     </SortableContext>
//                 </DndContext>
//             </AppLayout>
//         </>
//     );
// }

// WithOut URL

import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SortableProductCard from './SortableProductCard';

const breadcrumbs = [{ title: 'Products', href: '/admin/products' }];

export default function Index({ Data, User, categories, processing }) {
    const { Data: initialData, filters: initialFilters = {} } = usePage().props;

    const [filters, setFilters] = useState({
        search: initialFilters?.search ?? '',
        category: initialFilters?.category ?? '',
        min_price: initialFilters?.min_price ?? '',
        max_price: initialFilters?.max_price ?? '',
    });

    const [allItems, setAllItems] = useState(initialData); // all products
    const [filteredItems, setFilteredItems] = useState(initialData); // filtered products

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

    // Drag and delete handlers remain the same, applied on allItems or filteredItems accordingly

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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

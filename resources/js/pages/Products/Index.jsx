// import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
// import {Button } from '../../components/ui/button'
// import AppLayout from '@/layouts/app-layout';

// const breadcrumbs = [
//     {
//         title: 'Products',
//         href: '/Products',
//     },
// ];

// export default function Index() {

//     const { data, flash } = usePage().props;
//     const { processing , delete:destory } = useForm()

//     const handleDelete = (id) => {
//         if (confirm('Are you sure to delete?')) {
//             router.delete(`/Products/${id}`, {
//                 onSuccess: () => {
//                     console.log('Deleted successfully');
//                 },
//             });
//         }
//     };

//     {
//         console.log(flash);
//     }

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Products" />
//             <div className="m-4">
//                 Product Pages <br></br>
//                 <Button onClick={() => router.get('/Products/create')}>
//                     Create Product
//                 </Button>
//             </div>

//                 {data.length > 0 &&
//                     data.map((dt) => (
//                         <div
//                             key={dt.id}
//                             className="m-3 max-w-md rounded-xl border border-gray-700 bg-black/40 p-5 shadow-md transition hover:shadow-lg"
//                         >
//                             <div className="flex items-start justify-between gap-4">
//                                 <h3 className="max-w-[75%]  text-lg font-semibold text-white">
//                                     {dt.name}
//                                 </h3>

//                                 <span className="text-xs text-gray-400">
//                                     #{dt.id}
//                                 </span>
//                             </div>

//                             <p className="mt-2 line-clamp-2 text-sm text-gray-400">
//                                 {dt.description || 'No description'}
//                             </p>

//                             <div className="mt-3 text-lg font-bold text-green-500">
//                                 ₹ {dt.price}
//                             </div>

//                             <div className="mt-4 flex gap-2">
//                                 <Link
//                                     href={`/Products/${dt.id}/edit`}
//                                     className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-center text-sm text-white hover:bg-blue-700"
//                                 >
//                                     Edit
//                                 </Link>

//                                 <Link
//                                     href={`/Products/${dt.id}`}
//                                     className="flex-1 rounded-md bg-slate-600 px-3 py-1.5 text-center text-sm text-white hover:bg-slate-700"
//                                 >
//                                     Show
//                                 </Link>

//                                 <button
//                                     disabled={processing}
//                                     onClick={() => handleDelete(dt.id)}
//                                     className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     ))}

//         </AppLayout>
//     );
// }

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

import { useState } from 'react';

const breadcrumbs = [{ title: 'Products', href: '/Products' }];

export default function Index({ Data, User }) {
    const { Data: initialData } = usePage().props;
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
                },
            });
        }
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                {User.role === 1 ? (
                    //User Code
                    <>
                        {/* <h2>Welcome User {User.name}</h2> */}
                    </>
                ) : (
                    //Admin Code
                    <>
                        {/* <h2>Welcome Admin {User.name}</h2> */}
                        <div className="m-4">
                            <Button
                                onClick={() => router.get('/Products/create')}
                            >
                                Create Product
                            </Button>
                        </div>
                    </>
                )}
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
                        <div className="grid grid-cols-6">
                            {items.map((dt) => (
                                <SortableProductCard
                                    key={dt.id}
                                    dt={dt}
                                    processing={processing}
                                    onDelete={handleDelete}
                                    User={User}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </AppLayout>
        </>
    );
}

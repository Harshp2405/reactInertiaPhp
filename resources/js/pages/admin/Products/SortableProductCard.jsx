import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card.tsx';
import { useState } from 'react';

export default function SortableProductCard({ dt, processing, onDelete ,User }) {

    console.log(dt, '---------------------User----------------');
    const [isSelected, setIsSelected] = useState(dt.active);
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: dt.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { data, setData, post } = useForm({
        user_id:User.id,
        product_id: dt.id,
        Active:isSelected
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        setData({
            ...data,
            active: !isSelected, // Toggle the active status
        });

        // Send request to toggle the active status
        post(`/admin/products/${dt.id}/toggle-status`, {
            onSuccess: () => {
                setIsSelected(!isSelected); // Update the local state to match the toggled status
            },
        });
        console.log(data)
    };

    const defaultImage = dt.default_image
        ? `/storage/${dt.default_image}`
        : dt.images?.[0]
          ? `/storage/${dt.images[0].image}`
          : null;



    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="m-3 max-w-md border-gray-700 bg-black/40 shadow-md transition hover:shadow-lg"
        >
            {defaultImage ? (
                <div className="h-40 w-full overflow-hidden bg-gray-800">
                    <img
                        src={defaultImage}
                        alt={dt.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="flex h-40 items-center justify-center bg-gray-800 text-gray-500">
                    No Image
                </div>
            )}

            {/* Header */}
            <CardHeader className="space-y-2">
                <div className="flex items-start gap-2">
                    <span
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-gray-400 hover:text-white"
                    >
                        ⠿
                    </span>

                    <CardTitle className="line-clamp-2 flex-1 text-white">
                        {dt.name}
                    </CardTitle>
                </div>

                <CardDescription className="line-clamp-2 text-gray-400">
                    {dt.description || 'No description'}
                </CardDescription>
            </CardHeader>

            {/* Content */}
            <CardContent>
                <p className="text-lg font-semibold text-green-500">
                    ₹ {Number(dt.price)}
                </p>
            </CardContent>

            {/* Footer */}
            <CardFooter className="grid grid-rows-2 gap-2">
                <>
                    {/* Update */}
                    <Link
                        href={`/admin/products/${dt.id}/edit`}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-center text-sm text-white hover:bg-blue-700"
                    >
                        Update Data
                    </Link>
                    {/* Delete */}
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => onDelete(dt.id)}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </>

                {/* Show by id */}
                <Link
                    href={`/admin/products/${dt.id}`}
                    className="rounded-md bg-slate-600 px-3 py-1.5 text-center text-sm text-white hover:bg-slate-700"
                >
                    Show
                </Link>
                {/* Add to cart */}
                <Button
                    disabled={processing}
                    onClick={handleSubmit}
                    className={`${
                        isSelected
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {isSelected ? 'Active' : 'Inactive'}
                </Button>
            </CardFooter>
        </Card>
    );
}

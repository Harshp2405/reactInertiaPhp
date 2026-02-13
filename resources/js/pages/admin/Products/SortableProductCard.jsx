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

export default function SortableProductCard({ dt, processing, onDelete ,User }) {

    // console.log(User, '---------------------User----------------');

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: dt.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { data, setData, post } = useForm({
        user_id:User.id,
        product_id: dt.id,
        quantity: 1,
        price: Number(dt.price),
        total: Number(dt.price),
    });

    const increment = () => {
        if (data.quantity >= 15) return;

        const qty = data.quantity + 1;
        setData({
            ...data,
            quantity: qty,
            total: qty * data.price,
        });
    };

    const decrement = () => {
        if (data.quantity <= 1) return;

        const qty = data.quantity - 1;
        setData({
            ...data,
            quantity: qty,
            total: qty * data.price,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/Cart', {
            product_id: data.product_id,
            quantity: data.quantity,
        });
        // console.log("Add to cart")

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
                    ₹ {data.price}
                </p>

                <div className="my-1.5 mt-2 flex items-center gap-3">
                    <Button
                        size="xs"
                        onClick={decrement}
                        disabled={data.quantity <= 1}
                    >
                        -
                    </Button>

                    <span className="text-lg text-white">{data.quantity}</span>

                    <Button
                        size="xs"
                        onClick={increment}
                        disabled={data.quantity >= 15}
                    >
                        +
                    </Button>
                    <p className="mt-2 text-sm text-gray-400">
                        Total: ₹ {data.total}
                    </p>
                </div>
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
                {/* <Button
                    type="submit"
                    disabled={processing}
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Add To Cart
                </Button> */}
            </CardFooter>
        </Card>
    );
}

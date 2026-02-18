import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const breadcrumbs = [
    {
        title: 'Edit Product',
        href: '/productmanager',
    },
];

export default function EditProduct({ product, categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        parent_id: product.parent_id || '',
        images: [],
        quantity: 0,
        default_image: null,
        _method: 'put',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/productmanager/product/${product.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <div className="mx-auto max-w-3xl p-6">
                <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow">
                    <h1 className="text-2xl font-semibold text-white">
                        Edit Product
                    </h1>

                    {/* Current Default Image */}
                    {product.default_image_url && (
                        <div className="max-w-xs">
                            <Label className="mb-1 block text-gray-300">
                                Current Default Image
                            </Label>
                            <div className="aspect-square overflow-hidden rounded border border-gray-700">
                                <img
                                    src={product.default_image_url}
                                    className="h-full w-full object-cover"
                                    alt="Default"
                                />
                            </div>
                        </div>
                    )}

                    {/* Existing Gallery Images */}
                    {product.images?.length > 0 && (
                        <Carousel className="max-w-xs">
                            <CarouselContent>
                                {product.images.map((img) => (
                                    <CarouselItem key={img.id}>
                                        <div className="aspect-square overflow-hidden rounded border border-gray-700">
                                            <img
                                                src={`/storage/${img.image}`}
                                                className="h-full w-full object-cover"
                                                alt="Gallery"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {product.images.length > 1 && (
                                <>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </>
                            )}
                        </Carousel>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <Label className="text-gray-300">Name</Label>
                            <Input
                                className="border-gray-700 bg-gray-800 text-white"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <Label className="text-gray-300">Price</Label>
                            <Input
                                type="number"
                                className="border-gray-700 bg-gray-800 text-white"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.price}
                                </p>
                            )}
                        </div>
                        {/* quantity */}
                        <div>
                            <Label className="text-gray-300">Quantity</Label>
                            <Input
                                type="number"
                                className="border-gray-700 bg-gray-800 text-white"
                                value={data.quantity}
                                onChange={(e) =>
                                    setData('quantity', e.target.value)
                                }
                            />
                            {errors.quantity && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.quantity}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-gray-300">Description</Label>
                            <Textarea
                                className="min-h-24 border-gray-700 bg-gray-800 text-white"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label className="text-gray-300">Category</Label>
                            <select
                                value={data.parent_id}
                                onChange={(e) =>
                                    setData('parent_id', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white"
                            >
                                <option value="">— No Parent —</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Change Default Image */}
                        <div>
                            <Label className="text-gray-300">
                                Change Default Image
                            </Label>
                            <Input
                                type="file"
                                accept="image/*"
                                className="border-gray-700 bg-gray-800 text-white"
                                onChange={(e) =>
                                    setData('default_image', e.target.files[0])
                                }
                            />

                            {/* Preview */}
                            {data.default_image && (
                                <div className="mt-2 max-w-xs">
                                    <img
                                        src={URL.createObjectURL(
                                            data.default_image,
                                        )}
                                        className="h-32 w-32 rounded object-cover"
                                        alt="Preview"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Replace Gallery Images */}
                        <div>
                            <Label className="text-gray-300">
                                Replace Images
                            </Label>
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                className="border-gray-700 bg-gray-800 text-white"
                                onChange={(e) =>
                                    setData(
                                        'images',
                                        Array.from(e.target.files),
                                    )
                                }
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Product'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

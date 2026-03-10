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
import * as Yup from 'yup';
import { useState } from 'react';

const breadcrumbs = [{ title: 'Edit Product', href: '/admin/products' }];

export default function EditProduct({ product, categories = [] }) {
    const validation = Yup.object().shape({
        name: Yup.string().required('Name is Required'),
        price: Yup.number()
            .typeError('Must Be number')
            .min(1, 'Must be greater than 0')
            .max(1000000, 'Max value is 10 lakh')
            .positive('Cant less or be 0 Negative')
            .required('Cant empty'),
        description: Yup.string(),
        parent_id: Yup.string().nullable(),
        images: Yup.mixed(),
        quantity: Yup.number()
            .typeError('Must Be number')
            .min(1, 'Must be greater than 0')
            .max(10000, 'Max value is 10 thousand')
            .positive('Cant Negative')
            .required('Cant empty'),
    });

    const [yupErrors, setYupErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        parent_id: product.parent_id || '',
        images: [],
        quantity: product.quantity,
        _method: 'put',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validation.validate(data, { abortEarly: false });

            // Build FormData
            const formData = new FormData();

            // Always send regular fields
            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('description', data.description);
            formData.append('quantity', data.quantity);
            formData.append('parent_id', data.parent_id || '');
            formData.append('_method', 'put');

            // Only send default_image if user selected a new one
            if (data.default_image instanceof File) {
                formData.append('default_image', data.default_image);
            }

            // Multiple gallery images
            if (Array.isArray(data.images)) {
                data.images.forEach((file) =>
                    formData.append('images[]', file),
                );
            }

            post(`/admin/products/${product.id}`, {
                data: formData,
                forceFormData: true,
                preserveScroll: true,
            });
        } catch (err) {
            const formattedErrors = {};
            if (err.inner && err.inner.length > 0) {
                err.inner.forEach((error) => {
                    if (error.path) formattedErrors[error.path] = error.message;
                });
            } else if (err.path) {
                formattedErrors[err.path] = err.message;
            }
            setYupErrors(formattedErrors);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="mx-auto max-w-3xl p-6">
                <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow">
                    <h1 className="text-2xl font-semibold text-white">
                        Edit Product
                    </h1>

                    {/* Default Image */}
                    <div className="max-w-xs">
                        <Label className="mb-1 block text-gray-300">
                            Default Image
                        </Label>
                        <div className="mt-2 max-w-xs">
                            <img
                                src={
                                    data.default_image instanceof File
                                        ? URL.createObjectURL(
                                              data.default_image,
                                          )
                                        : product.default_image_url
                                }
                                className="h-32 w-32 rounded object-cover"
                                alt="Preview"
                            />
                        </div>
                    </div>

                    {/* Existing Gallery */}
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
                        <div>
                            <Label className="text-gray-300">Name</Label>
                            <Input
                                className="border-gray-700 bg-gray-800 text-white"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {(errors.name || yupErrors.name) && (
                                <p className="mt-1 text-sm text-red-500">
                                    {yupErrors.name || errors.name}
                                </p>
                            )}
                        </div>

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
                            {(errors.price || yupErrors.price) && (
                                <p className="mt-1 text-sm text-red-500">
                                    {yupErrors.price || errors.price}
                                </p>
                            )}
                        </div>

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
                            {(errors.quantity || yupErrors.quantity) && (
                                <p className="mt-1 text-sm text-red-500">
                                    {yupErrors.quantity || errors.quantity}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label className="text-gray-300">Description</Label>
                            <Textarea
                                className="min-h-24 border-gray-700 bg-gray-800 text-white"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            {yupErrors.description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {yupErrors.description}
                                </p>
                            )}
                        </div>

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
                        </div>

                        <div>
                            <Label className="text-gray-300">
                                Replace Gallery Images
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

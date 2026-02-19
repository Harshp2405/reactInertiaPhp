import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const breadcrumbs = [
    {
        title: 'Product',
        href: '/productmanager/product',
    },
];

export default function Singleproduct({ product }) {
    if (!product) return null;
    // console.log(
    //     product,
    //     '---------------------------Product----------------------------------',
    // );

    // 👉 Default image logic
    const defaultImage = product.default_image
        ? `/storage/${product.default_image}`
        : product.images?.[0]
          ? `/storage/${product.images[0].image}`
          : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product - ${product.name}`} />

            <div className="mx-auto mt-6 w-11/12 max-w-6xl">
                {/* Back Button */}
                <Link
                    href="/productmanager/product"
                    className="mb-5 inline-block text-sm text-blue-400 hover:underline"
                >
                    ← Back to Product
                </Link>

                <Card className="grid gap-8 border border-gray-800 bg-gray-900 p-6 shadow-lg md:grid-cols-2">
                    {/* LEFT SIDE — IMAGES */}
                    <div className="space-y-4">
                        {/* Default Image */}
                        {defaultImage ? (
                            <div className="aspect-square overflow-hidden rounded-xl border border-gray-700 shadow">
                                <img
                                    src={defaultImage}
                                    alt="Default product"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-square items-center justify-center rounded-xl border border-gray-700 text-gray-400">
                                No image available
                            </div>
                        )}

                        {/* Gallery Carousel */}
                        {product.images?.length > 0 && (
                            <Carousel>
                                <CarouselContent>
                                    {product.images.map((img) => (
                                        <CarouselItem
                                            key={img.id}
                                            className="basis-1/3"
                                        >
                                            <div className="aspect-square overflow-hidden rounded-lg border border-gray-700">
                                                <img
                                                    src={`/storage/${img.image}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        )}
                    </div>

                    {/* RIGHT SIDE — DETAILS */}
                    <div className="flex flex-col justify-between space-y-6">
                        {/* Product Title */}
                        <div>
                            <CardHeader className="p-0">
                                <CardTitle className="text-3xl font-bold text-white">
                                    {product.name}
                                </CardTitle>
                            </CardHeader>

                            {/* Price */}
                            <div className="mt-3 text-3xl font-semibold text-green-500">
                                ₹ {product.price}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-sm text-gray-400">
                                Description
                            </Label>

                            <p className="mt-1 text-sm leading-relaxed text-gray-300">
                                {product.description || 'No description'}
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <Label className="text-sm text-gray-400">
                                Category
                            </Label>

                            <p className="mt-1 text-sm text-gray-300">
                                {product.parent?.name || 'No Category'}
                            </p>

                            {/* Parent Hierarchy */}
                            {product.parent?.parent && (
                                <p className="text-xs text-gray-500">
                                    {product.parent.parent.name} →{' '}
                                    {product.parent.name}
                                </p>
                            )}
                        </div>

                        {/* Sub Categories */}
                        {product.children?.length > 0 && (
                            <div>
                                <Label className="text-sm text-gray-400">
                                    Sub Categories
                                </Label>

                                <p className="mt-1 text-sm text-gray-300">
                                    {product.children
                                        .map((child) => child.name)
                                        .join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

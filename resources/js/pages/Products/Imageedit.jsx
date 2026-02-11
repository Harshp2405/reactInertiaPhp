import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const breadcrumbs = [
    {
        title: 'Edit image Products',
        href: '/Products/Imageedit',
    },
];

export default function ImageEdit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        price: product.price,
        description: product.description,
    });

    const [imageFiles, setImageFiles] = useState([]);

    // const [preview, setPreview] = useState(null);

    console.log(product, ' ----------------Products ---------------');
    console.log(data, ' ----------------DATA ---------------');
    console.log(product, ' ----------------Image ---------------'); // should show images
    console.log(product.images);

    // useEffect(() => {
    //     if (!imageFile) {
    //         setPreview(null);
    //         return;
    //     }

    //     // const objurl = URL.createObjectURL(imageFile);
    //     // setPreview(objurl);

    //     return () => URL.revokeObjectURL(objurl);
    // }, [imageFile]);
    

    const handleImageSubmit = (e) => {
        e.preventDefault();

        if (!imageFiles.length) return;

        router.post(
            `/P/${product.id}`,
            {
                images: imageFiles,
            },
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );
    };
    

   
    console.log(JSON.stringify(errors));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Products image" />
            <div className="m-4">
                Product Image Edit <br></br>
                {Object.keys(errors).length > 0 && (
                    <div className="mb-4 bg-red-100 p-2 text-red-700">
                        {Object.values(errors).map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    </div>
                )}
                <h2>Curr Image </h2>
                <div>
                    {product.images && product.images.length > 0 ? (
                        <Carousel className="w-full">
                            <CarouselContent>
                                {product.images.map((img, index) => (
                                    <CarouselItem key={img.id}>
                                        <div className="aspect-square overflow-hidden rounded-lg border">
                                            <img
                                                src={`/storage/${img.image}`}
                                                alt={`Product image ${index + 1}`}
                                                className="h-full w-full object-cover"
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
                    ) : (
                        <div className="flex aspect-square items-center justify-center rounded-lg border text-sm text-gray-400">
                            No image available
                        </div>
                    )}
                </div>
                <form onSubmit={handleImageSubmit}>
                    <Label>Change Image</Label>

                    <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                            setImageFiles(Array.from(e.target.files))
                        }
                    />

                    <Button type="submit" className="mt-3">
                        Update Image
                    </Button>
                </form>
                <div>
                    {/* {preview && (
                        <div>
                            <p className="mb-1 text-sm text-gray-400">
                                Selected Image Preview
                            </p>
                            <img
                                src={preview}
                                alt="Selected preview"
                                className="h-40 w-full rounded object-cover ring-2 ring-blue-500"
                            />
                        </div>
                    )} */}
                </div>
            </div>
        </AppLayout>
    );
}

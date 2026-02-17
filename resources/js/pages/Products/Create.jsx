import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
const breadcrumbs = [
    {
        title: 'Create Products',
        href: '/Products/Create',
    },
];

export default function Create() {
    const { flash = {}, categories = [] } = usePage().props;
    // console.log(flash , "----------------------Data")

    // console.log(categories , "------------------cat")
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        description: '',
        parent_id: '',
        images: [],
        default_image: null,
        quantity: 0,
    });
    // console.log(data, '---------------------Data----------------');

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log(errors, '--- validation errors ---');
        }
    }, [errors]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/Products', {
            forceFormData: true,
            onSuccess: () => toast.success('Product created'),
            onError: () => toast.error('Failed'),
        });

        console.log(data);
    };

    console.log(JSON.stringify(errors));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Products" />
            <div className="m-4">
                Product Create <br></br>
                {flash?.success && (
                    <div className="mb-3 rounded bg-green-100 p-2 text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash.email && (
                    <div className="rounded bg-blue-100 p-2 text-blue-700">
                        {flash.email}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-3 rounded bg-red-100 p-2 text-red-700">
                        {flash.error}
                    </div>
                )}
                <Link
                    href="/Products"
                    className="mb-4 inline-block text-sm text-blue-500 hover:underline"
                >
                    ← Back to Products
                </Link>
                <form onSubmit={handleSubmit}>
                    <div className="gap-3">
                        <Label htmlFor="name">name of product</Label>
                        <br />
                        <Input
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <p className="text-red-600">{errors.name}</p>
                        )}
                        <br />

                        <Label htmlFor="price">price of product</Label>
                        <br />
                        <Input
                            name="price"
                            value={data.price}
                            onChange={handleChange}
                        />
                        {errors.price && (
                            <p className="text-red-600">{errors.price}</p>
                        )}
                        <br />

                        {/*  quantity */}
                        <Label htmlFor="quantity">quantity of product</Label>
                        <br />
                        <Input
                            name="quantity"
                            value={data.quantity}
                            onChange={handleChange}
                        />
                        {errors.quantity && (
                            <p className="text-red-600">{errors.quantity}</p>
                        )}
                        <br />

                        <Label htmlFor="description">
                            description of product
                        </Label>
                        <br />
                        <Textarea
                            name="description"
                            onChange={handleChange}
                            value={data.description}
                            className="rounded-sm border border-amber-50"
                        />
                        <br />
                        <Label htmlFor="parent_id">Category</Label>
                        <select
                            name="parent_id"
                            value={data.parent_id}
                            onChange={(e) =>
                                setData('parent_id', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">— No Parent (Top Level) —</option>

                            {categories.map((cat) => (
                                <option
                                    key={cat.id}
                                    value={cat.id}
                                    className="bg-gray-600 text-white"
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <br />
                        {errors.parent_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.parent_id}
                            </p>
                        )}
                        <br />
                        <Label htmlFor="images">Select Images</Label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setData('images', Array.from(e.target.files))
                            }
                        />
                        {errors.images && (
                            <p className="text-red-600">{errors.images}</p>
                        )}
                        <br />
                        <Label htmlFor="default_image">
                            Select Thumbnail Images
                        </Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData('default_image', e.target.files[0])
                            }
                        />
                        {errors.images && (
                            <p className="text-red-600">{errors.images}</p>
                        )}
                    </div>
                    <br />

                    <Button type="submit" className="my-2">
                        Add Product
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

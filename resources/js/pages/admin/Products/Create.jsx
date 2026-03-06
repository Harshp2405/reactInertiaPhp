// const validationSchema = Yup.object({
//     name: Yup.string().required('Name is required'),
//     price: Yup.number()
//         .typeError('Price must be a number')
//         .positive('Price must be positive')
//         .min(0, `Can't be 0`)
//         .max(1000000, `Can't Greater than 10 Lakhs`)
//         .required('Price is required'),
//     quantity: Yup.number()
//         .typeError('Quantity must be a number')
//         .integer('Quantity must be an integer')
//         .min(0, 'Quantity cannot be negative')
//         .max(10000, 'Max Quantity')
//         .required('Quantity is required'),
//     description: Yup.string(),
//     parent_id: Yup.string().nullable(),
//     images: Yup.mixed(),
//     default_image: Yup.mixed(),
// });
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const breadcrumbs = [
    {
        title: 'Create Products',
        href: '/admin/products/Create',
    },
];

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number()
        .typeError('Price must be a number')
        .positive('Price must be positive')
        .min(0, `Can't be less then 0`)
        .max(1000000, `Can't Greater than 10 Lakhs`)
        .required('Price is required'),
    quantity: Yup.number()
        .typeError('Quantity must be a number')
        .integer('Quantity must be an integer')
        .min(2, 'Quantity cannot be negative')
        .max(10000, 'Max Quantity')
        .required('Quantity is required'),
    description: Yup.string(),
    parent_id: Yup.string().nullable(),
    images: Yup.mixed(),
    default_image: Yup.mixed(),
});

export default function Create() {
    const { flash, categories = [] } = usePage().props;

    const initialValues = {
        name: '',
        price: '',
        description: '',
        parent_id: '',
        images: [],
        default_image: null,
        quantity: 1,
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();

        for (const key in values) {
            if (key === 'images' && values.images.length > 0) {
                values.images.forEach((file) =>
                    formData.append('images[]', file),
                );
            } else if (key === 'default_image' && values.default_image) {
                formData.append('default_image', values.default_image);
            } else {
                formData.append(key, values[key]);
            }
        }

        router.post('/admin/products', formData, {
            forceFormData: true,
            onSuccess: () => {
                resetForm();
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Products" />
            <div className="m-4">
                Product Create <br />
                {flash?.success && (
                    <div className="mb-3 rounded bg-green-100 p-2 text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-3 rounded bg-red-100 p-2 text-red-700">
                        {flash.error}
                    </div>
                )}
                <Link
                    href="/admin/products"
                    className="mb-4 inline-block text-sm text-blue-500 hover:underline"
                >
                    ← Back to Products
                </Link>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="gap-3">
                                <Label htmlFor="name">Name of product</Label>
                                <Field name="name" as={Input} />
                                <ErrorMessage
                                    name="name"
                                    component="p"
                                    className="text-red-600"
                                />
                                <br />

                                <Label htmlFor="price">Price of product</Label>
                                <Field name="price" as={Input} />
                                <ErrorMessage
                                    name="price"
                                    component="p"
                                    className="text-red-600"
                                />
                                <br />

                                <Label htmlFor="quantity">
                                    Quantity of product
                                </Label>
                                <Field name="quantity" as={Input} />
                                <ErrorMessage
                                    name="quantity"
                                    component="p"
                                    className="text-red-600"
                                />
                                <br />

                                <Label htmlFor="description">
                                    Description of product
                                </Label>
                                <Field
                                    name="description"
                                    as={Textarea}
                                    className="rounded-sm border border-amber-50"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="p"
                                    className="text-red-600"
                                />
                                <br />

                                <Label htmlFor="parent_id">Category</Label>
                                <Field
                                    as="select"
                                    name="parent_id"
                                    className="mt-1 w-full rounded-md border text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">
                                        — No Parent (Top Level) —
                                    </option>
                                    {categories.map((cat) => (
                                        <option
                                            key={cat.id}
                                            value={cat.id}
                                            className="bg-gray-600 text-white"
                                        >
                                            {cat.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="parent_id"
                                    component="p"
                                    className="text-red-600"
                                />
                                <br />

                                <Label htmlFor="images">Select Images</Label>
                                <br />
                                <input
                                    id="images"
                                    name="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFieldValue(
                                            'images',
                                            Array.from(e.target.files),
                                        )
                                    }
                                    className="rounded border p-1"
                                />
                                <ErrorMessage
                                    name="images"
                                    component="p"
                                    className="text-red-600"
                                />
                                <br />

                                <Label htmlFor="default_image">
                                    Select Thumbnail Image
                                </Label>
                                <br />
                                <input
                                    id="default_image"
                                    name="default_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFieldValue(
                                            'default_image',
                                            e.target.files[0],
                                        )
                                    }
                                    className="rounded border p-1"
                                />
                                <ErrorMessage
                                    name="default_image"
                                    component="p"
                                    className="text-red-600"
                                />
                            </div>
                            <br />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="my-2"
                            >
                                {isSubmitting ? 'Adding...' : 'Add Product'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </AppLayout>
    );
}

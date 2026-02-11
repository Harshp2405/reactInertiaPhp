import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '../../components/ui/button';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Trash } from 'lucide-react';

import { useState } from 'react';

const breadcrumbs = [{ title: 'Cart', href: '/Cart' }];

export default function Index({ Data }) {
    const { Data: initialData } = usePage().props;
    const [items, setItems] = useState(initialData);

    // console.log(items, '---------------------Data----------------');
    const { processing } = useForm();

    const finalTotal = (carts) => {
        return carts.reduce((sum, item) => {
            return sum + Number(item.total);
        }, 0);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure to delete?')) {
            router.delete(`/Cart/${id}`, {
                onSuccess: () => {
                    setItems((prev) => prev.filter((item) => item.id !== id));
                },
            });
        }
        console.log('delete', id);
    };

    const checkout = () => {
        router.get('/Checkout');
        console.log('Checkout');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cart" />

            <div className="m-4">Cart</div>
            {!items || items.length === 0 ? (
                <p className="text-center text-gray-400">Your cart is empty</p>
            ) : (
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-25"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((dt, key) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">
                                        {key + 1}
                                    </TableCell>
                                    <TableCell>{dt.product.name}</TableCell>
                                    <TableCell>{dt.product.price}</TableCell>
                                    <TableCell>{dt.quantity}</TableCell>
                                    <TableCell>{dt.total}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleDelete(dt.id);
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold">
                                <TableCell colSpan={4} className="text-left">
                                    Final Total
                                </TableCell>
                                <TableCell>
                                    {finalTotal(items).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Button
                        className="w-full"
                        onClick={() => {
                            checkout();
                        }}
                    >
                        {' '}
                        Checkout{' '}
                    </Button>
                </div>
            )}
        </AppLayout>
    );
}

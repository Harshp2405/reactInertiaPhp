import { Head, router, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Checkout({ cart }) {
    const { data, setData, post, processing, errors } = useForm({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
    });

    const subtotal = cart.reduce((sum, item) => sum + Number(item.total), 0);
    const tax = subtotal * 0.05;
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + tax + shipping;

    const submit = (e) => {
        e.preventDefault();
        console.log(data)
        post('/Checkout', {
            onSuccess: () => toast.success('Order placed successfully'),
            onError: () => toast.error('Order failed'),
        });

    };

    return (
        <>
            <Head title="Checkout" />

            <div className="mx-auto max-w-4xl p-6">
                <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
                <button
                    type="button"
                    onClick={() => router.get('/cart')}
                    className="mb-4 rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
                >
                    ← Back
                </button>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ======= Address Form ======= */}
                    <div className="rounded-lg bg-gray-900 p-6">
                        <h2 className="mb-3 text-lg font-semibold">
                            Shipping Address
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block">
                                    Address Line 1
                                </label>
                                <input
                                    type="text"
                                    value={data.address_line1}
                                    onChange={(e) =>
                                        setData('address_line1', e.target.value)
                                    }
                                    className="w-full rounded border bg-gray-800 p-2"
                                    placeholder="123 Street Name"
                                />
                                {errors.address_line1 && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.address_line1}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    value={data.address_line2}
                                    onChange={(e) =>
                                        setData('address_line2', e.target.value)
                                    }
                                    className="w-full rounded border bg-gray-800 p-2"
                                    placeholder="Apartment, Suite, etc (optional)"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block">City</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    className="w-full rounded border bg-gray-800 p-2"
                                    placeholder="City"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block">State</label>
                                <input
                                    type="text"
                                    value={data.state}
                                    onChange={(e) =>
                                        setData('state', e.target.value)
                                    }
                                    className="w-full rounded border bg-gray-800 p-2"
                                    placeholder="State"
                                />
                                {errors.state && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.state}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData('postal_code', e.target.value)
                                    }
                                    className="w-full rounded border bg-gray-800 p-2"
                                    placeholder="ZIP / Postal code"
                                />
                                {errors.postal_code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.postal_code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block">Country</label>
                                <input
                                    type="text"
                                    value={data.country}
                                    onChange={(e) =>
                                        setData('country', e.target.value)
                                    }
                                    className="w-full rounded border bg-gray-800 p-2"
                                    placeholder="Country"
                                />
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.country}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-4 w-full rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700"
                            >
                                {processing
                                    ? 'Placing Order...'
                                    : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* ======= Order Summary ======= */}
                    <div className="rounded-lg bg-gray-900 p-6">
                        <h2 className="mb-3 text-lg font-semibold">
                            Order Summary
                        </h2>

                        {cart.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b pb-2"
                                    >
                                        <div>
                                            <div className="font-semibold">
                                                {item.product.name}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                        <div className="font-semibold">
                                            ₹ {item.total}
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (5%)</span>
                                        <span>₹ {tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹ {shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>₹ {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

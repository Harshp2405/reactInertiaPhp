import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '../../components/ui/button';
import toast from "react-hot-toast";

export default function CreateReport() {
    const { data, setData, post, processing, errors } = useForm({
        type: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('report', {
            forceFormData: true,
            onSuccess: () => toast.success('Report Submitted'),
        });
        
        console.log(data)
        setData('type', '');
        setData('message','');
    };

    return (
        <AppLayout>
            <h1 className="mb-4 text-2xl font-bold">Submit a Report</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block font-medium">Type</label>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="bg-black text-white w-full rounded border p-2"
                    >
                        <option value="">Other</option>
                        <option value="delivery">Delivery</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Message</label>
                    <textarea
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="w-full rounded border p-2"
                        rows="5"
                        required
                    />
                    {errors.message && (
                        <p className="text-red-500">{errors.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={processing}>
                    Submit Report
                </Button>
            </form>
        </AppLayout>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AIChat({
res
}) {
    const { answer: initialAnswer = '' } = usePage().props; // Get answer from Inertia page props

    const { data, setData, post, processing, errors } = useForm({
        question: '',
    });
    const [cooldown, setCooldown] = useState(false);
    const [answer, setAnswer] = useState(initialAnswer);

    // Optional: log validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log(errors, 'Validation errors');
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cooldown) return;

        setCooldown(true);

        post('/admin/ai/ask', {
            onSuccess: (page) => {
                if (page.props.answer) setAnswer(page.props.answer);
            },
            onFinish: () => {
                setTimeout(() => setCooldown(false), 3000);
            },
        });
    };

    console.log(answer);


    return (
        <AppLayout>
            <Head title="AI Dashboard Assistant" />
            <div className="m-4">
                <h2 className="mb-2 text-xl font-bold">
                    AI Dashboard Assistant
                </h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Ask about products, orders, users..."
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        className="mb-2 w-80 border p-2"
                    />
                    {errors.question && (
                        <p className="text-red-600">{errors.question}</p>
                    )}
                    <br />
                    <Button
                        type="submit"
                        className="bg-blue-500 p-2 text-white"
                        disabled={processing || cooldown}
                    >
                        {processing ? 'Loading...' : 'Ask AI'}
                    </Button>
                </form>

                <div className="mt-4 rounded border p-4">
                    {answer ? answer : 'Answer will appear here...'}
                </div>
            </div>
        </AppLayout>
    );
}

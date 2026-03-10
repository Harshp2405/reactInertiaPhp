import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AIChat() {
    const { answer: initialAnswer = '' } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        question: '',
    });

    const [cooldown, setCooldown] = useState(false);
    const [answer, setAnswer] = useState(initialAnswer);

    useEffect(() => {
        if (initialAnswer) {
            setAnswer(initialAnswer);
        }
    }, [initialAnswer]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.question) {
            toast.error('Please enter a question');
            return;
        }

        if (cooldown) return;

        setCooldown(true);

        post('/admin/ai/ask', {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.answer) {
                    setAnswer(page.props.answer);
                }
            },
            onError: () => {
                toast.error('AI request failed');
            },
            onFinish: () => {
                setTimeout(() => setCooldown(false), 2000);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="AI Dashboard Assistant" />

            <div className="m-6 max-w-2xl">
                <h2 className="mb-4 text-2xl font-bold">
                    🤖 AI Dashboard Assistant
                </h2>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Ask: top selling products, revenue, low stock..."
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                    />

                    <Button type="submit" disabled={processing || cooldown}>
                        {processing ? 'Thinking...' : 'Ask AI'}
                    </Button>
                </form>

                {errors.question && (
                    <p className="mt-2 text-red-600">{errors.question}</p>
                )}

                <div className="mt-6 rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold">AI Result</h3>

                    <pre className="text-sm whitespace-pre-wrap">
                        {processing
                            ? 'Generating SQL and fetching data...'
                            : answer || 'Answer will appear here...'}
                    </pre>
                </div>
            </div>
        </AppLayout>
    );
}

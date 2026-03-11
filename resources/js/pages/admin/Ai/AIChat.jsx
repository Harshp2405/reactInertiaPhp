import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// show orders by city
export default function AIChat() {
    const { answer: initialAnswer = '' } = usePage().props;
console.log(initialAnswer);
    const { data, setData, post, processing, errors } = useForm({
        question: '',
    });

    const [cooldown, setCooldown] = useState(false);
    const [answer, setAnswer] = useState('');
    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        handleResponse(initialAnswer);
    }, [initialAnswer]);
    const handleResponse = (res) => {
        if (!res) return;

        try {
            const parsed = typeof res === 'string' ? JSON.parse(res) : res;

            // analytics or AI data table
            if (parsed?.success && Array.isArray(parsed.data)) {
                setTableData(parsed.data); // <-- extract data array
                setAnswer('');
                return;
            }

            // SQL SELECT result (already array)
            if (Array.isArray(parsed)) {
                setTableData(parsed);
                setAnswer('');
                return;
            }

            // action message
            if (parsed?.success && parsed?.message) {
                setAnswer(parsed.message);
                setTableData([]);
                return;
            }

            // error message
            if (parsed?.success === false && parsed?.error) {
                setAnswer(parsed.error);
                setTableData([]);
                return;
            }

            // fallback
            setAnswer(JSON.stringify(parsed, null, 2));
            setTableData([]);
        } catch {
            setAnswer(res);
            setTableData([]);
        }
    };
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
                handleResponse(page.props.answer);
                setData('question', '');
            },
            onError: () => toast.error('AI request failed'),
            onFinish: () => setTimeout(() => setCooldown(false), 2000),
        });
    };

    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    return (
        <AppLayout>
            <Head title="AI Dashboard Assistant" />

            <div className="m-6 max-w-6xl">
                <h2 className="mb-4 text-2xl font-bold">
                    🤖 AI Dashboard Assistant
                </h2>

                <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                    <Input
                        type="text"
                        placeholder="Ask: top products, revenue, orders..."
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        className="flex-1"
                    />

                    <Button type="submit" disabled={processing || cooldown}>
                        {processing ? 'Thinking...' : 'Ask AI'}
                    </Button>
                </form>

                {errors.question && (
                    <p className="mb-2 text-red-600">{errors.question}</p>
                )}

                <div className="rounded-lg border p-4">
                    <h3 className="mb-4 font-semibold">AI Result</h3>

                    {processing && (
                        <p className="text-gray-500">Generating response...</p>
                    )}

                    {/* TABLE */}
                    {!processing && tableData.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th
                                                key={col}
                                                className="border p-2 text-left"
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {tableData.map((row, i) => (
                                        <tr key={i}>
                                            {columns.map((col) => (
                                                <td
                                                    key={col}
                                                    className="border p-2"
                                                >
                                                    {row[col] ?? '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TEXT RESULT */}
                    {!processing && tableData.length === 0 && answer && (
                        <p className="text-sm whitespace-pre-wrap">
                            {typeof answer === 'string'
                                ? answer
                                : JSON.stringify(answer, null, 2)}
                        </p>
                    )}

                    {/* EMPTY */}
                    {!processing && !answer && tableData.length === 0 && (
                        <p className="text-gray-400">
                            Answer will appear here...
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

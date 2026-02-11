import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AppLayout from '@/layouts/app-layout';
const breadcrumbs = [
    {
        title: 'Todo',
        href: '/todolist',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="m-4">
                Todo Page <br></br>
                <div className="m-4 max-w-md rounded-xl border p-5 shadow">
                    <h2 className="mb-4 text-lg font-semibold">Add Todo</h2>

                   

                    <form  className="space-y-4">
                        {/* Todo title */}
                        <div>
                            <Label>Todo title</Label>
                            <Input
                                // value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Enter todo..."
                            />
                        </div>

                        {/* Priority dropdown */}
                        <div>
                            <Label>Priority</Label>
                            <select
                                // value={data.priority}
                                onChange={(e) =>
                                    setData('priority', e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <Button type="submit" disabled={processing}>
                            Add Todo
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

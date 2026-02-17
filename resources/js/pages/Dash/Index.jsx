import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
    },
];

export default function Dashboard({ user }) {
    console.log(user);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute inset-0 rounded-2xl bg-black/20 backdrop-blur-sm" />

                        <div className="relative z-10 flex h-full flex-col justify-between text-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold tracking-wide">
                                    Wallet Balance
                                </h2>
                            </div>

                            <div>
                                <p className="text-3xl font-bold">
                                    {user.Wallet
                                        ? `$${user.Wallet.toFixed(2)}`
                                        : '$0.00'}
                                </p>
                                <p className="text-sm opacity-80">
                                    Available Balance
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm opacity-90">
                                <span>Updated just now</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}

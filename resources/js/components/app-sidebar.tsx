import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    ListOrderedIcon,
    ShoppingBasketIcon,
    ShoppingCartIcon,
    UserIcon,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
// import Products from '@/routes/Products';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

interface User {
    name: string;
    role: string;

}
// Define user object
interface Auth {
    user?: User | null;
    name?: string | "" | null;
}

const userNavItem: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: dashboard(),
    //     icon: LayoutGrid,
    // },
    {
        title: 'DashBoard User',
        href: '/user/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Product',
        href: '/Products',
        icon: ShoppingBasketIcon,
    },
    // {
    //     title: 'Todo-List',
    //     href: "/todo",
    //     icon: BookOpenTextIcon,
    // },
    {
        title: 'Cart',
        href: '/cart',
        icon: ShoppingCartIcon,
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: ListOrderedIcon,
    },
];
const adminNavItems: NavItem[] = [

    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Product',
        href: '/admin/products',
        icon: ShoppingBasketIcon,
    },
    {
        title: 'users',
        href: '/admin/users',
        icon: UserIcon,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ListOrderedIcon,
    },
];
const productNavItems: NavItem[] = [
    
    {
        title: 'Product Dashboard',
        href: '/productmanager/dashboard',
        icon: ShoppingBasketIcon,
    },
    {
        title: 'Product Index',
        href: '/productmanager/product',
        icon: ShoppingBasketIcon,
    },
   
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const navMap: Record<number, NavItem[]> = {
    0: adminNavItems, // Super Admin
    1: userNavItem, // User
    2: productNavItems, // Product Manager
    3: userNavItem, // Order Manager
    4: userNavItem, // Customer Support
    5: userNavItem, // Accountant
};
  

export function AppSidebar() {
    const { auth } = usePage<{ auth?: Auth }>().props;
    // Optional chaining to avoid undefined errors
    const userRole = (auth?.user?.role) ?? 1;
    const navItems = navMap[Number(userRole)] || userNavItem;
    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                {/* Sidebar header */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Sidebar main navigation */}
                <SidebarContent>
                    <NavMain items={navItems} />
                </SidebarContent>

                {/* Sidebar footer */}
                <SidebarFooter>
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        </>
    );
}

import { ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Boxes,
  Database,
  LayoutDashboard,
  Package,
  Receipt,
  ReceiptText,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users2,
  Search,
} from "lucide-react";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
      <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center">
        <Boxes className="size-4 text-primary" />
      </div>
      <span className="font-semibold tracking-tight">StockFlow</span>
    </Link>
  );
}

function Topbar() {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-14 items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="hidden md:flex items-center gap-2 w-full max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <SidebarInput placeholder="Search products, suppliers, invoices..." className="pl-8" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/sales">New Invoice</Link>
          </Button>
          <Avatar className="size-8">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  children?: { to: string; label: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { to: "/products", label: "Products", icon: <Package className="size-4" /> },
  { to: "/categories", label: "Categories", icon: <Tags className="size-4" /> },
  { to: "/suppliers", label: "Suppliers", icon: <Truck className="size-4" /> },
  { to: "/purchases", label: "Purchases", icon: <ShoppingCart className="size-4" /> },
  { to: "/sales", label: "Billing", icon: <Receipt className="size-4" /> },
  { to: "/reports", label: "Reports", icon: <BarChart3 className="size-4" /> },
  { to: "/users", label: "Users & Roles", icon: <Users2 className="size-4" /> },
  { to: "/backup", label: "Backup", icon: <Database className="size-4" /> },
  { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
];

function SidebarNav() {
  const { pathname } = useLocation();
  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader>
        <Brand />
        <SidebarInput placeholder="Quick search" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.label}>
                    <NavLink to={item.to} className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} StockFlow
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Topbar />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

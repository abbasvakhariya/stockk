import { PieChart, Users, Boxes, Truck, PackagePlus, BarChart, Settings, Receipt, FileText } from "lucide-react";
import type { Role } from "@/context/auth";

export type NavItem = { label: string; to: string; icon: React.ComponentType<any> };
export const NAV_CONFIG: Record<Uppercase<Role>, NavItem[]> = {
  OWNER: [
    { label: "Dashboard", to: "/owner/dashboard", icon: PieChart },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Inventory", to: "/inventory", icon: Boxes },
    { label: "Suppliers", to: "/suppliers", icon: Truck },
    { label: "Purchases", to: "/purchases", icon: PackagePlus },
    { label: "Reports", to: "/reports", icon: BarChart },
    { label: "Settings", to: "/settings", icon: Settings },
  ],
  MANAGER: [
    { label: "Dashboard", to: "/manager/dashboard", icon: PieChart },
    { label: "Inventory", to: "/inventory", icon: Boxes },
    { label: "Team", to: "/team", icon: Users },
    { label: "Purchases", to: "/purchases", icon: PackagePlus },
    { label: "Reports", to: "/reports/basic", icon: BarChart },
    { label: "Billing", to: "/billing", icon: Receipt },
  ],
  STAFF: [
    { label: "Dashboard", to: "/staff/dashboard", icon: PieChart },
    { label: "Billing / POS", to: "/billing", icon: Receipt },
    { label: "My Bills", to: "/billing/my", icon: FileText },
  ],
};

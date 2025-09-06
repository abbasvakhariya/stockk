import type { Role } from "@/context/auth";

export type RouteKey =
  | "dashboard"
  | "products"
  | "categories"
  | "suppliers"
  | "purchases"
  | "sales"
  | "reports"
  | "users"
  | "backup"
  | "settings";

const ACCESS: Record<RouteKey, Role[]> = {
  dashboard: ["owner", "manager", "staff"],
  products: ["owner", "manager", "staff"],
  categories: ["owner", "manager"],
  suppliers: ["owner", "manager"],
  purchases: ["owner", "manager"],
  sales: ["owner", "manager", "staff"],
  reports: ["owner", "manager"],
  users: ["owner", "manager"],
  backup: ["owner", "manager"],
  settings: ["owner", "manager"],
};

export function canAccess(route: RouteKey, role: Role) {
  return ACCESS[route].includes(role);
}

// Action-level permissions
export const can = {
  manageUsers: (role: Role) => ["owner", "manager"].includes(role),
  manageCatalog: (role: Role) => ["owner", "manager"].includes(role),
  editProductPrices: (role: Role) => ["owner", "manager"].includes(role),
  deleteProducts: (role: Role) => ["owner", "manager"].includes(role),
  createPurchases: (role: Role) => ["owner", "manager"].includes(role),
  giveDiscounts: (role: Role) => ["owner", "manager"].includes(role),
};

export const ACCESS_MATRIX = ACCESS;

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ID = string;
export type Unit = "pcs" | "kg" | "ltr" | "box";
export type Product = {
  id: ID;
  name: string;
  sku: string;
  categoryId?: ID | null;
  unit: Unit;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock?: number;
  supplierId?: ID | null;
};
export type Category = { id: ID; name: string; parentId?: ID | null };
export type Supplier = { id: ID; name: string; phone?: string; email?: string; address?: string };
export type PurchaseItem = { productId: ID; qty: number; cost: number };
export type Purchase = { id: ID; date: string; supplierId?: ID | null; items: PurchaseItem[] };
export type SaleItem = { productId: ID; qty: number; price: number; discount?: number };
export type Sale = { id: ID; date: string; items: SaleItem[]; discount?: number; taxRate?: number; customer?: string };
export type Adjustment = { id: ID; date: string; productId: ID; qtyChange: number; reason?: string };

export type Settings = { currency: string; defaultTaxRate: number };

export type DataState = {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  purchases: Purchase[];
  sales: Sale[];
  adjustments: Adjustment[];
  settings: Settings;
};

const LS_KEY = "sf_data_v1";

const initialState: DataState = {
  products: [
    { id: "p1", name: "Apple Juice 1L", sku: "SKU-001", categoryId: undefined, unit: "ltr", costPrice: 1.2, sellPrice: 2.5, stock: 12, minStock: 10, supplierId: undefined },
    { id: "p2", name: "Rice 5kg", sku: "SKU-014", categoryId: undefined, unit: "kg", costPrice: 4.5, sellPrice: 7.0, stock: 6, minStock: 8, supplierId: undefined },
    { id: "p3", name: "Soap Bar", sku: "SKU-023", categoryId: undefined, unit: "pcs", costPrice: 0.3, sellPrice: 0.8, stock: 4, minStock: 12, supplierId: undefined },
    { id: "p4", name: "Milk 500ml", sku: "SKU-034", categoryId: undefined, unit: "ltr", costPrice: 0.4, sellPrice: 1.0, stock: 5, minStock: 10, supplierId: undefined },
  ],
  categories: [
    { id: "c1", name: "Beverages" },
    { id: "c2", name: "Food" },
    { id: "c3", name: "Household" },
  ],
  suppliers: [
    { id: "s1", name: "General Supplier", email: "contact@supplier.com" },
  ],
  purchases: [],
  sales: [],
  adjustments: [],
  settings: { currency: "$", defaultTaxRate: 5 },
};

function load(): DataState {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return initialState;
  try {
    const parsed = JSON.parse(raw) as DataState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function save(state: DataState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export type DataContextType = DataState & {
  addOrUpdateProduct: (p: Partial<Product> & { id?: ID }) => void;
  removeProduct: (id: ID) => void;
  addOrUpdateCategory: (c: Partial<Category> & { id?: ID }) => void;
  removeCategory: (id: ID) => void;
  addOrUpdateSupplier: (s: Partial<Supplier> & { id?: ID }) => void;
  removeSupplier: (id: ID) => void;
  recordPurchase: (po: Omit<Purchase, "id">) => ID;
  recordSale: (so: Omit<Sale, "id">) => ID | null;
  adjustStock: (a: Omit<Adjustment, "id">) => ID;
  setSettings: (s: Partial<Settings>) => void;
  exportJson: () => string;
  importJson: (json: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataState>(load());

  useEffect(() => save(state), [state]);

  const addOrUpdateProduct: DataContextType["addOrUpdateProduct"] = (p) => {
    setState((s) => {
      if (p.id) {
        return { ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, ...p } as Product : x)) };
      }
      const created: Product = {
        id: crypto.randomUUID(),
        name: "",
        sku: "",
        unit: "pcs",
        costPrice: 0,
        sellPrice: 0,
        stock: 0,
        ...p,
      } as Product;
      return { ...s, products: [created, ...s.products] };
    });
  };

  const removeProduct = (id: ID) => setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));

  const addOrUpdateCategory = (c: Partial<Category> & { id?: ID }) =>
    setState((s) => {
      if (c.id) return { ...s, categories: s.categories.map((x) => (x.id === c.id ? { ...x, ...c } as Category : x)) };
      return { ...s, categories: [{ id: crypto.randomUUID(), name: "", ...c } as Category, ...s.categories] };
    });

  const removeCategory = (id: ID) => setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }));

  const addOrUpdateSupplier = (v: Partial<Supplier> & { id?: ID }) =>
    setState((s) => {
      if (v.id) return { ...s, suppliers: s.suppliers.map((x) => (x.id === v.id ? { ...x, ...v } as Supplier : x)) };
      return { ...s, suppliers: [{ id: crypto.randomUUID(), name: "", ...v } as Supplier, ...s.suppliers] };
    });

  const removeSupplier = (id: ID) => setState((s) => ({ ...s, suppliers: s.suppliers.filter((c) => c.id !== id) }));

  const recordPurchase = (po: Omit<Purchase, "id">) => {
    const id = crypto.randomUUID();
    setState((s) => {
      const products = s.products.map((p) => {
        const add = po.items.find((i) => i.productId === p.id);
        return add ? { ...p, stock: p.stock + add.qty, costPrice: add.cost } : p;
      });
      return { ...s, products, purchases: [{ id, ...po }, ...s.purchases] };
    });
    return id;
  };

  const recordSale = (so: Omit<Sale, "id">) => {
    // Validate stock
    for (const it of so.items) {
      const p = state.products.find((x) => x.id === it.productId);
      if (!p || p.stock < it.qty) return null;
    }
    const id = crypto.randomUUID();
    setState((s) => {
      const products = s.products.map((p) => {
        const use = so.items.find((i) => i.productId === p.id);
        return use ? { ...p, stock: p.stock - use.qty } : p;
      });
      return { ...s, products, sales: [{ id, ...so }, ...s.sales] };
    });
    return id;
  };

  const adjustStock = (a: Omit<Adjustment, "id">) => {
    const id = crypto.randomUUID();
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === a.productId ? { ...p, stock: p.stock + a.qtyChange } : p)),
      adjustments: [{ id, ...a }, ...s.adjustments],
    }));
    return id;
  };

  const setSettings = (s2: Partial<Settings>) => setState((s) => ({ ...s, settings: { ...s.settings, ...s2 } }));

  const exportJson = () => JSON.stringify(state, null, 2);
  const importJson = (json: string) => {
    try {
      const next = JSON.parse(json) as DataState;
      setState({ ...initialState, ...next });
    } catch {}
  };

  const value: DataContextType = useMemo(
    () => ({ ...state, addOrUpdateProduct, removeProduct, addOrUpdateCategory, removeCategory, addOrUpdateSupplier, removeSupplier, recordPurchase, recordSale, adjustStock, setSettings, exportJson, importJson }),
    [state],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

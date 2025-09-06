import { useMemo, useState } from "react";
import { useData, type Product } from "@/context/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Products() {
  const {
    products,
    categories,
    suppliers,
    addOrUpdateProduct,
    removeProduct,
    adjustStock,
  } = useData();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ unit: "pcs", stock: 0 });

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.sku.toLowerCase().includes(q.toLowerCase()),
      ),
    [products, q],
  );

  const save = () => {
    addOrUpdateProduct(form as any);
    setOpen(false);
    setForm({ unit: "pcs", stock: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground">
            Manage catalog, pricing, and stock
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-56"
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setForm({ unit: "pcs", stock: 0 });
                }}
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {form.id ? "Edit Product" : "New Product"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  placeholder="SKU"
                  value={form.sku || ""}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
                <Select
                  value={form.unit as any}
                  onValueChange={(v) => setForm({ ...form, unit: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ltr">ltr</SelectItem>
                    <SelectItem value="box">box</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cost Price"
                  value={form.costPrice ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, costPrice: parseFloat(e.target.value) })
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Sell Price"
                  value={form.sellPrice ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, sellPrice: parseFloat(e.target.value) })
                  }
                />
                <Input
                  type="number"
                  placeholder="Min Stock"
                  value={form.minStock ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minStock: parseInt(e.target.value || "0"),
                    })
                  }
                />
                <Select
                  value={form.categoryId || ""}
                  onValueChange={(v) =>
                    setForm({ ...form, categoryId: v || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.supplierId || ""}
                  onValueChange={(v) =>
                    setForm({ ...form, supplierId: v || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="sm:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={save}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>Low stock items are highlighted</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => {
                const low =
                  p.minStock !== undefined && p.stock <= (p.minStock || 0);
                return (
                  <TableRow key={p.id} className={low ? "bg-orange-500/5" : ""}>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.unit}</TableCell>
                    <TableCell className="text-right">
                      {p.costPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {p.sellPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {low ? (
                        <Badge variant="destructive">
                          {p.stock} / {p.minStock}
                        </Badge>
                      ) : (
                        p.stock
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setForm(p);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeProduct(p.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          adjustStock({
                            date: new Date().toISOString(),
                            productId: p.id,
                            qtyChange: 1,
                            reason: "Manual",
                          })
                        }
                      >
                        +1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          adjustStock({
                            date: new Date().toISOString(),
                            productId: p.id,
                            qtyChange: -1,
                            reason: "Manual",
                          })
                        }
                      >
                        -1
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useData, type PurchaseItem } from "@/context/data";
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

export default function Purchases() {
  const { products, suppliers, recordPurchase } = useData();
  const [supplierId, setSupplierId] = useState<string | undefined>(
    suppliers[0]?.id,
  );
  const [items, setItems] = useState<PurchaseItem[]>([]);

  const addRow = () =>
    setItems([
      ...items,
      {
        productId: products[0]?.id!,
        qty: 1,
        cost: products[0]?.costPrice || 0,
        batch: "",
        expiry: "",
      },
    ]);
  const update = (i: number, patch: Partial<PurchaseItem>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const total = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.cost, 0),
    [items],
  );

  const save = () => {
    if (!items.length) return;
    recordPurchase({ date: new Date().toISOString(), supplierId, items });
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Purchases
          </h1>
          <p className="text-muted-foreground">
            Create purchase orders and receive stock
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addRow}>Add Item</Button>
          <Button onClick={save}>Save & Receive</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Receiving increases on-hand stock</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Select
                      value={it.productId}
                      onValueChange={(v) =>
                        update(idx, {
                          productId: v,
                          cost:
                            products.find((p) => p.id === v)?.costPrice || 0,
                        })
                      }
                    >
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="text-right"
                      value={it.qty}
                      onChange={(e) =>
                        update(idx, { qty: parseInt(e.target.value || "0") })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      step="0.01"
                      className="text-right"
                      value={it.cost}
                      onChange={(e) =>
                        update(idx, { cost: parseFloat(e.target.value || "0") })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {(it.qty * it.cost).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {total.toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

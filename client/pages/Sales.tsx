import { useMemo, useState } from "react";
import { useData, type SaleItem } from "@/context/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Sales() {
  const { products, recordSale, settings } = useData();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(settings.defaultTaxRate);
  const [message, setMessage] = useState<string | null>(null);

  const addRow = () => setItems([...items, { productId: products[0]?.id!, qty: 1, price: products[0]?.sellPrice || 0 }]);
  const update = (i:number, patch:Partial<SaleItem>) => setItems(items.map((it,idx)=> idx===i? { ...it, ...patch }: it));

  const subtotal = useMemo(()=> items.reduce((s,i)=> s + i.qty * i.price - (i.discount||0), 0), [items]);
  const tax = useMemo(()=> subtotal * (taxRate/100), [subtotal, taxRate]);
  const total = useMemo(()=> Math.max(0, subtotal - discount + tax), [subtotal, discount, tax]);

  const save = () => {
    if (!items.length) return;
    const id = recordSale({ date: new Date().toISOString(), items, discount, taxRate });
    if (!id) { setMessage("Insufficient stock for one or more items"); return; }
    setMessage(`Invoice ${id.slice(0,8).toUpperCase()} saved`);
    setItems([]); setDiscount(0); setTaxRate(settings.defaultTaxRate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground">Create sales invoices with discount and tax</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={addRow}>Add Item</Button>
          <Button onClick={save}>Save Invoice</Button>
        </div>
      </div>

      {message && <div className="text-sm text-emerald-400">{message}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Stock will decrease when invoice is saved</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it, idx)=> {
                const product = products.find(p=>p.id===it.productId)!;
                const lt = it.qty*it.price - (it.discount||0);
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <Select value={it.productId} onValueChange={(v)=>update(idx,{ productId:v, price: products.find(p=>p.id===v)?.sellPrice || 0 })}>
                        <SelectTrigger className="w-56"><SelectValue placeholder="Product" /></SelectTrigger>
                        <SelectContent>
                          {products.map(p=> <SelectItem key={p.id} value={p.id}>{p.name} <span className="text-xs text-muted-foreground">(stock {p.stock})</span></SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right"><Input type="number" className="text-right" value={it.qty} onChange={(e)=>update(idx,{ qty: parseInt(e.target.value||"0") })} /></TableCell>
                    <TableCell className="text-right"><Input type="number" step="0.01" className="text-right" value={it.price} onChange={(e)=>update(idx,{ price: parseFloat(e.target.value||"0") })} /></TableCell>
                    <TableCell className="text-right"><Input type="number" step="0.01" className="text-right" value={it.discount||0} onChange={(e)=>update(idx,{ discount: parseFloat(e.target.value||"0") })} /></TableCell>
                    <TableCell className="text-right">{lt.toFixed(2)}</TableCell>
                    <TableCell className="text-right"><Button variant="destructive" size="sm" onClick={()=> setItems(items.filter((_,i)=>i!==idx))}>Remove</Button></TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="text-right">Subtotal</TableCell>
                <TableCell className="text-right">{subtotal.toFixed(2)}</TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="text-right">Discount</TableCell>
                <TableCell className="text-right"><Input type="number" step="0.01" className="text-right w-28 ml-auto" value={discount} onChange={(e)=>setDiscount(parseFloat(e.target.value||"0"))} /></TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="text-right">Tax %</TableCell>
                <TableCell className="text-right"><Input type="number" step="0.01" className="text-right w-28 ml-auto" value={taxRate} onChange={(e)=>setTaxRate(parseFloat(e.target.value||"0"))} /></TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="text-right font-semibold">Total</TableCell>
                <TableCell className="text-right font-bold">{total.toFixed(2)}</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useData } from "@/context/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function toCSV(rows: string[][]) { return rows.map(r=> r.map(v=>`"${v.replace(/"/g,'""')}"`).join(",")).join("\n"); }

export default function Reports() {
  const { products, purchases, sales, settings } = useData();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filteredSales = useMemo(()=> sales.filter(s=> (!from || s.date>=from) && (!to || s.date<=to)), [sales, from, to]);
  const filteredPurchases = useMemo(()=> purchases.filter(p=> (!from || p.date>=from) && (!to || p.date<=to)), [purchases, from, to]);

  const inventoryValue = useMemo(()=> products.reduce((s,p)=> s + p.stock * p.costPrice, 0), [products]);
  const salesRevenue = useMemo(()=> filteredSales.reduce((s,inv)=> s + inv.items.reduce((a,i)=> a + i.qty*i.price - (i.discount||0), 0) - (inv.discount||0), 0), [filteredSales]);
  const taxCollected = useMemo(()=> filteredSales.reduce((s,inv)=> s + (inv.items.reduce((a,i)=> a + i.qty*i.price - (i.discount||0), 0) - (inv.discount||0))*(inv.taxRate||0)/100, 0), [filteredSales]);
  const purchaseCost = useMemo(()=> filteredPurchases.reduce((s,p)=> s + p.items.reduce((a,i)=> a + i.qty*i.cost, 0), 0), [filteredPurchases]);
  const cogsApprox = useMemo(()=> filteredSales.reduce((s,inv)=> s + inv.items.reduce((a,i)=> { const p = products.find(pr=>pr.id===i.productId); return a + (p?.costPrice||0)*i.qty; }, 0), 0), [filteredSales, products]);
  const profit = useMemo(()=> salesRevenue - cogsApprox, [salesRevenue, cogsApprox]);

  const exportCSV = () => {
    const rows: string[][] = [["Metric","Amount"]];
    rows.push(["Inventory Value", String(inventoryValue.toFixed(2))]);
    rows.push(["Sales Revenue", String(salesRevenue.toFixed(2))]);
    rows.push(["Tax Collected", String(taxCollected.toFixed(2))]);
    rows.push(["Approx. COGS", String(cogsApprox.toFixed(2))]);
    rows.push(["Profit", String(profit.toFixed(2))]);
    const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'report.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Filter by date and export CSV</p>
        </div>
        <div className="flex gap-2 items-center">
          <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="bg-background border rounded px-2 py-1" />
          <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="bg-background border rounded px-2 py-1" />
          <Button onClick={exportCSV}>Export CSV</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Inventory</CardTitle><CardDescription>Current stock valuation</CardDescription></CardHeader>
          <CardContent className="text-2xl font-bold">{settings.currency}{inventoryValue.toFixed(2)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sales</CardTitle><CardDescription>Revenue and tax</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>Revenue: <b>{settings.currency}{salesRevenue.toFixed(2)}</b></div>
              <div>Tax: <b>{settings.currency}{taxCollected.toFixed(2)}</b></div>
              <div>Approx. COGS: <b>{settings.currency}{cogsApprox.toFixed(2)}</b></div>
              <div>Profit: <b>{settings.currency}{profit.toFixed(2)}</b></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Sales</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredSales.map(s => {
                const total = s.items.reduce((a,i)=> a + i.qty*i.price - (i.discount||0), 0) - (s.discount||0);
                return <TableRow key={s.id}><TableCell>{s.date.slice(0,10)}</TableCell><TableCell className="text-right">{settings.currency}{total.toFixed(2)}</TableCell></TableRow>
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

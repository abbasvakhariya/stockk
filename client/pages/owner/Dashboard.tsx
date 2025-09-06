import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, Bar, BarChart } from "recharts";
import { Link } from "react-router-dom";
import { useData } from "@/context/data";

const sales12 = Array.from({ length: 12 }, (_, i) => ({
  m: new Date(0, i).toLocaleString("en", { month: "short" }),
  v: Math.round(2000 + Math.random() * 4000),
}));
const top5 = [
  { name: "Apple Juice", v: 420 },
  { name: "Rice 5kg", v: 360 },
  { name: "Soap Bar", v: 310 },
  { name: "Milk 500ml", v: 280 },
  { name: "Pasta 1kg", v: 240 },
];

export default function OwnerDashboard() {
  const { products, purchases } = useData();
  const low = products.filter(
    (p) => p.minStock !== undefined && p.stock <= (p.minStock || 0),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-muted-foreground">Org-wide KPIs and reports</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/users">Add User</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/purchases">Create Purchase Order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/reports">Export Reports</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {[
          { t: "Total Sales Today", v: "$12,430" },
          { t: "This Month", v: "$184,210" },
          { t: "This Year", v: "$2.1M" },
          { t: "Gross Profit (M)", v: "$62,400" },
          { t: "Stock Value", v: "$154,320" },
          { t: "Low Stock", v: String(low.length) },
          { t: "Managers", v: "3" },
          { t: "Employees", v: "14" },
        ].map((k) => (
          <Card key={k.t} className="transition-transform hover:scale-[1.01]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{k.t}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{k.v}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>12-month Sales Trend</CardTitle>
            <CardDescription>Revenue over last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[260px] w-full">
              <LineChart data={sales12}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[260px] w-full">
              <BarChart data={top5} layout="vertical">
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                {/* @ts-ignore */}
                <Bar dataKey="v" fill="hsl(var(--primary))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Below reorder level</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty/Min</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {low.slice(0, 8).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-right">
                      {p.stock} / {p.minStock}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.slice(0, 8).map((po) => {
                  const total = po.items.reduce(
                    (s, i) => s + i.qty * i.cost,
                    0,
                  );
                  return (
                    <TableRow key={po.id}>
                      <TableCell>{po.date.slice(0, 10)}</TableCell>
                      <TableCell>{po.supplierId || "-"}</TableCell>
                      <TableCell className="text-right">
                        ${total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Package, AlertTriangle, DollarSign } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const salesData = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 3900 },
  { day: "Wed", sales: 5200 },
  { day: "Thu", sales: 6100 },
  { day: "Fri", sales: 4800 },
  { day: "Sat", sales: 7300 },
  { day: "Sun", sales: 6800 },
];

const lowStock = [
  { sku: "SKU-001", name: "Apple Juice 1L", stock: 6, min: 10 },
  { sku: "SKU-014", name: "Rice 5kg", stock: 3, min: 8 },
  { sku: "SKU-023", name: "Soap Bar", stock: 2, min: 12 },
  { sku: "SKU-034", name: "Milk 500ml", stock: 4, min: 10 },
];

export default function Dashboard() {
  const totalStockValue = useMemo(() => 154320.75, []);
  const lowStockCount = useMemo(() => lowStock.length, []);
  const todaysSales = useMemo(() => 21890.5, []);
  const profitToday = useMemo(() => 6420.25, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Key metrics and quick actions for your store</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Stock Value" value={`$${totalStockValue.toLocaleString()}`} icon={<DollarSign className="size-4" />} trend={{ value: 3.4, positive: true }} />
        <MetricCard title="Low Stock" value={lowStockCount.toString()} icon={<AlertTriangle className="size-4" />} trend={{ value: 2, positive: false, suffix: " items" }} />
        <MetricCard title="Today’s Sales" value={`$${todaysSales.toLocaleString()}`} icon={<ArrowUpRight className="size-4" />} trend={{ value: 12.1, positive: true }} />
        <MetricCard title="Profit Today" value={`$${profitToday.toLocaleString()}`} icon={<ArrowDownRight className="size-4 rotate-45" />} trend={{ value: 5.2, positive: true }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Sales (last 7 days)</CardTitle>
              <CardDescription>Monitor your recent revenue performance</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/reports">View Reports</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
              className="w-full h-[260px]"
            >
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="sales" type="natural" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#fillSales)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Low Stock</CardTitle>
              <CardDescription>Items below minimum threshold</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/products">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.sku}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{item.stock} / {item.min}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Perform frequent tasks faster</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button asChild variant="default"><Link to="/sales">Create Invoice</Link></Button>
          <Button asChild variant="outline"><Link to="/purchases">Receive Goods</Link></Button>
          <Button asChild variant="outline"><Link to="/products">Add Product</Link></Button>
          <Button asChild variant="outline"><Link to="/reports">Export Reports</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend?: { value: number; positive: boolean; suffix?: string } }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1", trend.positive ? "text-emerald-600" : "text-red-600")}>
            {trend.positive ? "▲" : "▼"} {trend.value}% {trend.suffix || "from last period"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

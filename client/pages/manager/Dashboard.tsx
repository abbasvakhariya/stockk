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
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";

const daily = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  v: Math.round(200 + Math.random() * 300),
}));
const byEmp = [
  { n: "Ali", v: 3200 },
  { n: "Sara", v: 2900 },
  { n: "Omar", v: 2500 },
  { n: "Zed", v: 2100 },
];

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">Team & operations</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/purchases">New PO</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Stock Adjustment</Link>
          </Button>
          <Button asChild>
            <Link to="/users">Invite Staff</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-5">
        {[
          { t: "Team Active Today", v: "6" },
          { t: "Monthly Sales", v: "$84,210" },
          { t: "Open POs", v: "3" },
          { t: "Low Stock", v: "7" },
          { t: "Adjustments This Week", v: "5" },
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
            <CardTitle>Daily Sales – current month</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[240px] w-full">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="mgrDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="d" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="v"
                  type="natural"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#mgrDaily)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Employee (month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[240px] w-full">
              <BarChart data={byEmp} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="n" hide />
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
            <CardTitle>Today’s Staff Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Ali", 12, "$540"],
                  ["Sara", 10, "$480"],
                  ["Omar", 8, "$360"],
                ].map((r) => (
                  <TableRow key={r[0]}>
                    <TableCell>{r[0]}</TableCell>
                    <TableCell className="text-right">{r[1]}</TableCell>
                    <TableCell className="text-right">{r[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending POs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO#</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["PO-1024", "General", "2025-01-22", "In Transit"],
                  ["PO-1025", "FreshCo", "2025-01-25", "Pending"],
                ].map((r) => (
                  <TableRow key={r[0]}>
                    {r.map((c, i) => (
                      <TableCell key={i}>{c}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

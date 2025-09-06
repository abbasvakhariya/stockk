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
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart } from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useData } from "@/context/data";

const hours = Array.from({ length: 12 }, (_, i) => ({
  h: i * 2,
  v: Math.round(50 + Math.random() * 60),
}));

export default function StaffDashboard() {
  const { user } = useAuth();
  const { sales } = useData();
  const my = sales.filter((s) => s.createdBy === user?.id).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Dashboard
          </h1>
          <p className="text-muted-foreground">
            Quick POS & today’s performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/billing">Open POS</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/billing/my">My Bills</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/sales">Return / Exchange</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {[
          { t: "Today’s Bills", v: String(my.length) },
          { t: "Today’s Revenue", v: "$1,240" },
          { t: "Avg Order Value", v: "$24.80" },
          { t: "My Shift", v: "7h 20m" },
        ].map((k) => (
          <Card key={k.t} className="transition-transform hover:scale-[1.01]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{k.t}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{k.v}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Last 5 Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {my.map((b) => {
                const t =
                  b.items.reduce(
                    (s, i) => s + i.qty * i.price - (i.discount || 0),
                    0,
                  ) - (b.discount || 0);
                return (
                  <TableRow key={b.id}>
                    <TableCell>{b.date.slice(0, 10)}</TableCell>
                    <TableCell className="text-right">
                      ${t.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today’s Hourly Sales</CardTitle>
          <CardDescription>Mini sparkline</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-20 w-full">
            <LineChart data={hours}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

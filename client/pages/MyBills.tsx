import { useAuth } from "@/context/auth";
import { useData } from "@/context/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MyBills() {
  const { user } = useAuth();
  const { sales } = useData();
  const my = sales.filter(s=> s.createdBy === user?.id);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Bills</h1>
      <Card>
        <CardHeader><CardTitle>Recent</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
            <TableBody>
              {my.map(b=> {
                const t = b.items.reduce((s,i)=> s + i.qty*i.price - (i.discount||0), 0) - (b.discount||0);
                return <TableRow key={b.id}><TableCell>{b.date.slice(0,10)}</TableCell><TableCell className="text-right">${t.toFixed(2)}</TableCell></TableRow>;
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

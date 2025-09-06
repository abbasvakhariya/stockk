import { useState } from "react";
import { useData } from "@/context/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Suppliers() {
  const { suppliers, addOrUpdateSupplier, removeSupplier } = useData();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const add = () => {
    if (!form.name.trim()) return;
    addOrUpdateSupplier(form);
    setForm({ name: "", email: "", phone: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">Manage supplier contacts</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          <Input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <Input placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <div className="col-span-3 flex justify-end"><Button onClick={add}>Add</Button></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>List</CardTitle>
          <CardDescription>Edit inline; changes auto-save</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map(s => (
                <TableRow key={s.id}>
                  <TableCell><Input defaultValue={s.name} onBlur={(e)=>addOrUpdateSupplier({ id:s.id, name:e.target.value })} /></TableCell>
                  <TableCell><Input defaultValue={s.email} onBlur={(e)=>addOrUpdateSupplier({ id:s.id, email:e.target.value })} /></TableCell>
                  <TableCell><Input defaultValue={(s as any).phone||""} onBlur={(e)=>addOrUpdateSupplier({ id:s.id, phone:e.target.value })} /></TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="destructive" onClick={()=>removeSupplier(s.id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

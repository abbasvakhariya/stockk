import { useState } from "react";
import { useData } from "@/context/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Categories() {
  const { categories, addOrUpdateCategory, removeCategory } = useData();
  const [name, setName] = useState("");
  const [parent, setParent] = useState<string>("__none");

  const add = () => {
    if (!name.trim()) return;
    addOrUpdateCategory({ name: name.trim(), parentId: parent === "__none" ? undefined : parent });
    setName(""); setParent("__none");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Categories
          </h1>
          <p className="text-muted-foreground">Organize products by category</p>
        </div>
        <div className="flex gap-2 items-center">
          <Input placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={parent} onValueChange={setParent}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Parent (optional)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">None</SelectItem>
              {categories.map(c=> <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={add}>Add</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>List</CardTitle>
          <CardDescription>
            Click a name to edit; press Enter to save
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Input defaultValue={c.name} onBlur={(e) => addOrUpdateCategory({ id: c.id, name: e.target.value })} />
                  </TableCell>
                  <TableCell>
                    <Select value={c.parentId || ""} onValueChange={(v)=>addOrUpdateCategory({ id:c.id, parentId: v || null })}>
                      <SelectTrigger className="w-48"><SelectValue placeholder="Parent" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories.filter(x=>x.id!==c.id).map(x=> <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCategory(c.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

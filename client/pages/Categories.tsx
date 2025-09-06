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

  const add = () => {
    if (!name.trim()) return;
    addOrUpdateCategory({ name: name.trim() });
    setName("");
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
        <div className="flex gap-2">
          <Input
            placeholder="New category"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Input
                      defaultValue={c.name}
                      onBlur={(e) =>
                        addOrUpdateCategory({ id: c.id, name: e.target.value })
                      }
                    />
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

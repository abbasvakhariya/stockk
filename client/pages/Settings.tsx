import { useState } from "react";
import { useData } from "@/context/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { settings, setSettings } = useData();
  const [currency, setCurrency] = useState(settings.currency);
  const [tax, setTax] = useState(settings.defaultTaxRate);

  const save = () => setSettings({ currency, defaultTaxRate: tax });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">General preferences</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Store Preferences</CardTitle><CardDescription>Used across the app</CardDescription></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Currency symbol</label>
            <Input value={currency} onChange={(e)=>setCurrency(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Default Tax Rate (%)</label>
            <Input type="number" step="0.01" value={tax} onChange={(e)=>setTax(parseFloat(e.target.value||"0"))} />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={save}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useRef, useState } from "react";
import { useData } from "@/context/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Backup() {
  const { exportJson, importJson } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const doExport = () => {
    const data = exportJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'stockflow-backup.json'; a.click(); URL.revokeObjectURL(url);
  };

  const doImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const text = await file.text(); importJson(text); setMsg('Backup imported');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Backup</h1>
        <p className="text-muted-foreground">Export and import your data locally</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Data Backup</CardTitle><CardDescription>JSON export/import</CardDescription></CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button onClick={doExport}>Export JSON</Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={doImport} />
          <Button variant="outline" onClick={()=>fileRef.current?.click()}>Import JSON</Button>
          {msg && <span className="text-emerald-400 text-sm">{msg}</span>}
        </CardContent>
      </Card>
    </div>
  );
}

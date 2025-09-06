import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-muted-foreground mt-1">{description}</p>
          ) : null}
        </div>
        <Button asChild variant="outline"><Link to="/">Back to Dashboard</Link></Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            This page is a placeholder. Ask Fusion to implement this screen with the exact workflows you need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>You can add fields, tables, filters, and charts tailored to your store.</li>
            <li>Data can be stored locally or connected to a cloud database later.</li>
            <li>Export, import, backups, and permissions can be added on request.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

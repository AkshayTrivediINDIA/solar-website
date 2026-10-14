import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeads } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = { title: "Leads" };

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  won: "outline",
  lost: "destructive",
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          {leads.length} {leads.length === 1 ? "enquiry" : "enquiries"} received from the website.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {leads.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {isSupabaseConfigured()
                ? "No leads yet."
                : "Connect Supabase to start capturing leads. Enquiries are logged to the server console until then."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(l.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div>{l.phone}</div>
                        {l.email ? (
                          <div className="text-xs text-muted-foreground">{l.email}</div>
                        ) : null}
                        {l.city ? (
                          <div className="text-xs text-muted-foreground">{l.city}</div>
                        ) : null}
                      </TableCell>
                      <TableCell className="capitalize">{l.type}</TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground">
                        {l.product_interest ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-56 truncate text-muted-foreground">
                        {l.message ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[l.status] ?? "secondary"} className="capitalize">
                          {l.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

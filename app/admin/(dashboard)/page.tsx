import Link from "next/link";
import { AlertTriangle, Package, TrendingUp, UserCheck, Users } from "lucide-react";
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
import { getLeadStats, getLeads, getProducts } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, leads, products] = await Promise.all([
    getLeadStats(),
    getLeads(),
    getProducts(),
  ]);

  const cards = [
    { label: "Total leads", value: stats.total, icon: Users },
    { label: "New leads", value: stats.new, icon: TrendingUp },
    { label: "Contacted", value: stats.contacted, icon: UserCheck },
    { label: "Products", value: products.length, icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store activity.</p>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Supabase not configured</p>
            <p className="mt-0.5">
              Add your Supabase keys to <code>.env.local</code> to persist leads. The catalog is
              currently served from bundled seed data.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="font-heading text-3xl font-bold">{c.value}</p>
              </div>
              <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">Latest leads</h2>
            <Link href="/admin/leads" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          {leads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No leads yet. Enquiries from the website will appear here.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 5).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.phone}</TableCell>
                    <TableCell className="capitalize">{l.type}</TableCell>
                    <TableCell className="max-w-48 truncate text-muted-foreground">
                      {l.product_interest ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {l.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

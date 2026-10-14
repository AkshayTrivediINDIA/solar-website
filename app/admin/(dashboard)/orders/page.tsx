import { Banknote, CreditCard, IndianRupee, Package } from "lucide-react";
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
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { getOrders, getOrderStats } from "@/lib/orders";
import { formatINR } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = { title: "Orders" };

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminOrdersPage() {
  const [orders, stats] = await Promise.all([getOrders(), getOrderStats()]);

  const cards = [
    { label: "Total orders", value: stats.total, icon: Package },
    { label: "Pending", value: stats.pending, icon: Banknote },
    { label: "Paid orders", value: stats.paid, icon: CreditCard },
    { label: "Revenue (paid)", value: formatINR(stats.revenue), icon: IndianRupee },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage customer orders and payments.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="font-heading text-2xl font-bold">{c.value}</p>
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
          {orders.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {isSupabaseConfigured()
                ? "No orders yet. Orders placed on the website will appear here."
                : "Connect Supabase to view orders."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium whitespace-nowrap">{o.order_number}</TableCell>
                      <TableCell>
                        <div>{o.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                        <div className="text-xs text-muted-foreground">
                          {o.city}, {o.state}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">{formatINR(o.total)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase text-muted-foreground">
                            {o.payment_method === "cod" ? "Cash on Delivery" : "Online"}
                          </span>
                          <Badge
                            variant={o.payment_status === "paid" ? "default" : "secondary"}
                            className="w-fit capitalize"
                          >
                            {o.payment_status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <OrderStatusSelect orderId={o.id} status={o.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(o.created_at)}
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

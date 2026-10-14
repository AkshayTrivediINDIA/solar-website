import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/server";
import { getOrdersByUser } from "@/lib/orders";
import { formatINR } from "@/lib/site";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  refunded: "bg-slate-100 text-slate-700",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = await getOrdersByUser(user.id);
  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    user.phone ??
    "there";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight">My account</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email ?? user.phone}</span>
          {name && name !== (user.email ?? user.phone) ? ` · ${name}` : ""}
        </p>
      </div>

      <h2 className="mb-4 font-heading text-lg font-semibold">Order history</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <Package className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">You have not placed any orders yet.</p>
            <Link href="/shop" className={cn(buttonVariants())}>
              Browse products
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Link
                    href={`/order/${order.order_number}`}
                    className="font-heading font-semibold hover:text-primary"
                  >
                    {order.order_number}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)} · {order.order_items?.length ?? 0} item
                    {(order.order_items?.length ?? 0) === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                      STATUS_STYLES[order.status],
                    )}
                  >
                    {order.status}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                      PAYMENT_STYLES[order.payment_status],
                    )}
                  >
                    {order.payment_method === "cod" ? "COD · " : ""}
                    {order.payment_status}
                  </span>
                  <span className="font-heading font-semibold">{formatINR(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

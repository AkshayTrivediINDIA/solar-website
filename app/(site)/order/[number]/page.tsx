import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrderByNumber } from "@/lib/orders";
import { formatINR, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  processing: "default",
  shipped: "default",
  delivered: "outline",
  cancelled: "destructive",
};

export default async function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const order = await getOrderByNumber(number);
  if (!order) notFound();

  const paid = order.payment_status === "paid";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">Thank you for your order!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order <span className="font-semibold text-foreground">{order.order_number}</span> has been
          received. Our team will contact you on {order.customer_phone} to confirm delivery.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <span className="font-heading font-semibold">{order.order_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[order.status] ?? "secondary"} className="capitalize">
                {order.status}
              </Badge>
              <Badge variant={paid ? "default" : "secondary"} className="capitalize">
                {paid ? "Paid" : order.payment_method === "cod" ? "COD" : "Payment pending"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span>
                  {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                </span>
                <span className="font-medium">{formatINR(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between pt-1 text-base">
              <span className="font-medium">Total</span>
              <span className="font-heading font-bold text-primary">{formatINR(order.total)}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-sm font-semibold">Delivery to</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customer_name}, {order.customer_phone}
              <br />
              {order.address_line1}
              {order.address_line2 ? `, ${order.address_line2}` : ""}
              <br />
              {order.city}, {order.state} — {order.pincode}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={whatsappLink(`Hi, I want to confirm my order ${order.order_number}`)}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <MessageCircle className="size-4" /> Track on WhatsApp
        </a>
        <Link href="/shop" className={cn(buttonVariants())}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/site/cart-sheet";
import { cartSubtotal, useCartHydrated, useCartStore } from "@/lib/cart-store";
import { formatINR } from "@/lib/site";

export function CartView() {
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(items);

  if (!hydrated) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Browse our solar products and add items to your cart.</p>
        <Button nativeButton={false} render={<Link href="/shop" />}>Browse products</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Shopping cart ({items.length})
          </h1>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted-foreground transition hover:text-destructive"
          >
            Clear cart
          </button>
        </div>

        <div className="divide-y rounded-xl border">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
              >
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col gap-1">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                  {item.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatINR(item.price)} · {item.unit}
                </span>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QuantityStepper productId={item.productId} quantity={item.quantity} />
                  <div className="flex items-center gap-4">
                    <span className="font-heading font-semibold">
                      {formatINR(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="text-muted-foreground transition hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/shop"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          ← Continue shopping
        </Link>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-heading text-xl font-bold text-primary">{formatINR(subtotal)}</span>
          </div>
          <Button size="lg" className="h-11 w-full" nativeButton={false} render={<Link href="/checkout" />}>
            Proceed to checkout <ArrowRight className="size-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Installation & site survey quoted separately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

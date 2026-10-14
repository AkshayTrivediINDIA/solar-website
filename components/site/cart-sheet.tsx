"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartCount, cartSubtotal, useCartHydrated, useCartStore } from "@/lib/cart-store";
import { formatINR } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const count = hydrated ? cartCount(items) : 0;
  const subtotal = cartSubtotal(items);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={cn("relative", className)}
            aria-label="Open cart"
          />
        }
      >
        <ShoppingCart className="size-5" />
        {count > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart {count > 0 ? `(${count})` : ""}</SheetTitle>
        </SheetHeader>

        {!hydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCart className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Link href="/shop" className={cn("text-sm font-medium text-primary hover:underline")}>
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-2 text-sm font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{formatINR(item.price)} each</span>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <QuantityStepper productId={item.productId} quantity={item.quantity} />
                      <button
                        type="button"
                        onClick={() => useCartStore.getState().remove(item.productId)}
                        className="text-muted-foreground transition hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t px-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading text-lg font-semibold">{formatINR(subtotal)}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" nativeButton={false} render={<Link href="/cart" />}>
                  View cart
                </Button>
                <Button nativeButton={false} render={<Link href="/checkout" />}>Checkout</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function QuantityStepper({
  productId,
  quantity,
  className,
}: {
  productId: string;
  quantity: number;
  className?: string;
}) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  return (
    <div className={cn("flex items-center rounded-lg border", className)}>
      <button
        type="button"
        onClick={() => setQuantity(productId, quantity - 1)}
        disabled={quantity <= 1}
        className="grid size-8 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <button
        type="button"
        onClick={() => setQuantity(productId, quantity + 1)}
        className="grid size-8 place-items-center text-muted-foreground transition hover:text-foreground"
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

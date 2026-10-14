"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const add = useCartStore((s) => s.add);
  const router = useRouter();
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    add(product, quantity);
    toast.success("Added to cart", { description: `${quantity} × ${product.name}` });
  }

  function handleBuyNow() {
    add(product, quantity);
    router.push("/checkout");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Quantity</span>
        <div className="flex items-center rounded-lg border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="grid size-9 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="grid size-9 place-items-center text-muted-foreground transition hover:text-foreground"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
        {product.stock > 0 ? (
          <span className="text-xs text-muted-foreground">{product.stock} available</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-11 flex-1"
          disabled={outOfStock}
          onClick={handleAdd}
        >
          <ShoppingCart className="size-4" /> Add to cart
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-11 flex-1"
          disabled={outOfStock}
          onClick={handleBuyNow}
        >
          <Zap className="size-4" /> Buy now
        </Button>
      </div>
      {outOfStock ? (
        <p className="text-xs font-medium text-destructive">
          Currently out of stock — send an enquiry and we will notify you.
        </p>
      ) : null}
    </div>
  );
}

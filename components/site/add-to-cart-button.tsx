"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  variant = "default",
  size = "default",
  label = "Add to cart",
  iconOnly = false,
}: {
  product: Product;
  quantity?: number;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  label?: string;
  iconOnly?: boolean;
}) {
  const add = useCartStore((s) => s.add);

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      className={className}
      aria-label={iconOnly ? "Add to cart" : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(product, quantity);
        toast.success("Added to cart", { description: product.name });
      }}
    >
      <ShoppingCart className="size-4" />
      {iconOnly ? null : label}
    </Button>
  );
}

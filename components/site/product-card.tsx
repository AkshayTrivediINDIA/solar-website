import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/site";
import type { Product } from "@/lib/types";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const hasDiscount = Boolean(product.mrp && product.mrp > product.price);
  const discount = hasDiscount
    ? Math.round((1 - product.price / (product.mrp as number)) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {product.badge ? (
            <Badge className="absolute top-2 left-2">{product.badge}</Badge>
          ) : null}
          {hasDiscount ? (
            <Badge variant="destructive" className="absolute top-2 right-2">
              {discount}% off
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <span className="text-xs text-muted-foreground">{product.category_name}</span>
          <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary">{product.name}</h3>
          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
            <span className="text-base font-semibold">{formatINR(product.price)}</span>
            {hasDiscount ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatINR(product.mrp as number)}
              </span>
            ) : null}
          </div>
          <span className="text-[11px] text-muted-foreground">{product.unit}</span>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <AddToCartButton
          product={product}
          variant="outline"
          size="sm"
          className="w-full"
          label="Add to cart"
        />
      </div>
    </div>
  );
}

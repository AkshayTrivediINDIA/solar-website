import Link from "next/link";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getCategories, getProducts } from "@/lib/data";

export const metadata = {
  title: "Shop Solar Products",
  description:
    "Buy solar panels, inverters, batteries, charge controllers and complete rooftop solar systems online.",
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

type SearchParams = { category?: string; q?: string; sort?: string };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category?.trim() || undefined;
  const q = params.q?.trim() || undefined;
  const sort = (params.sort as SearchParams["sort"]) || "featured";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category, q, sort: sort as "featured" | "price-asc" | "price-desc" | "newest" }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        {activeCategory ? (
          <>
            <span className="px-1.5">/</span>
            <span className="text-foreground">{activeCategory.name}</span>
          </>
        ) : null}
      </nav>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {activeCategory ? activeCategory.name : "All solar products"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {activeCategory?.description ??
            "Genuine, BIS-certified solar products with warranty and expert support."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="space-y-6">
          <form action="/shop" method="get" className="space-y-3">
            <div className="flex gap-2">
              <Input name="q" defaultValue={q} placeholder="Search products..." />
              <Button type="submit" size="icon" aria-label="Search">
                <Search className="size-4" />
              </Button>
            </div>
            {category ? <input type="hidden" name="category" value={category} /> : null}
          </form>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Categories</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/shop"
                  className={cn(
                    "block rounded-md px-2 py-1.5 hover:bg-muted",
                    !category && "bg-muted font-medium",
                  )}
                >
                  All products
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/shop?category=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className={cn(
                      "block rounded-md px-2 py-1.5 hover:bg-muted",
                      category === c.slug && "bg-muted font-medium",
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Sort by</h2>
            <ul className="space-y-1 text-sm">
              {SORTS.map((s) => (
                <li key={s.value}>
                  <Link
                    href={{
                      pathname: "/shop",
                      query: {
                        ...(category ? { category } : {}),
                        ...(q ? { q } : {}),
                        sort: s.value,
                      },
                    }}
                    className={cn(
                      "block rounded-md px-2 py-1.5 hover:bg-muted",
                      sort === s.value && "bg-muted font-medium",
                    )}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-4 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </div>

          {products.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <p className="font-medium">No products match your filters.</p>
              <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

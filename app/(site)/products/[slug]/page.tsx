import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, Phone, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductCard } from "@/components/site/product-card";
import { ProductPurchase } from "@/components/site/product-purchase";
import { LeadForm } from "@/components/site/lead-form";
import { formatINR, siteConfig, whatsappLink } from "@/lib/site";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.short_description ?? product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.short_description ?? undefined,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const hasDiscount = Boolean(product.mrp && product.mrp > product.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.short_description ?? product.description,
    sku: product.sku,
    category: product.category_name,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="px-1.5">/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="px-1.5">/</span>
        <Link href={`/shop?category=${product.category_slug}`} className="hover:text-foreground">
          {product.category_name}
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category_name}</Badge>
            {product.badge ? <Badge>{product.badge}</Badge> : null}
            {product.stock > 0 ? (
              <span className="text-xs font-medium text-emerald-600">In stock</span>
            ) : (
              <span className="text-xs font-medium text-destructive">Out of stock</span>
            )}
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight">{product.name}</h1>

          <p className="text-muted-foreground">
            {product.short_description ?? product.description}
          </p>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-heading text-3xl font-bold text-primary">
              {formatINR(product.price)}
            </span>
            {hasDiscount ? (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatINR(product.mrp as number)}
                </span>
                <Badge variant="destructive">
                  Save {formatINR((product.mrp as number) - product.price)}
                </Badge>
              </>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {product.unit} · Inclusive of all taxes · GST invoice available
          </p>

          <ProductPurchase product={product} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(`Hi, I want a quote for ${product.name}`)}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 flex-1")}
            >
              <MessageCircle className="size-4" /> Enquire on WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.salesPhone}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 flex-1")}
            >
              <Phone className="size-4" /> Call to order
            </a>
          </div>

          <div className="grid gap-2 rounded-xl border bg-muted/30 p-4 text-sm">
            <span className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Pan-India delivery & installation available</span>
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Manufacturer warranty & BIS certification</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-primary" /> Subsidy & net-metering assistance</span>
          </div>

          {product.specs.length > 0 ? (
            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">Specifications</h2>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 border-b py-1.5 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {product.description ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-heading text-xl font-semibold">Product details</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
        </section>
      ) : null}

      <Separator className="my-12" />

      <section id="enquiry" className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Get a quote for this product
          </h2>
          <p className="text-muted-foreground">
            Share your details and our team will contact you with the best price, subsidy eligibility
            and installation options.
          </p>
        </div>
        <LeadForm
          type="quote"
          productInterest={product.name}
          title={`Enquire: ${product.name}`}
          submitLabel="Request price"
        />
      </section>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

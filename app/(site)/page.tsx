import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Headset,
  IndianRupee,
  PanelsTopLeft,
  ShieldCheck,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/site/product-card";
import { LeadForm } from "@/components/site/lead-form";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { siteConfig, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: IndianRupee,
    title: "Subsidy assistance",
    body: "Full support for PM Surya Ghar subsidy — up to ₹78,000 for residential rooftops.",
  },
  {
    icon: ShieldCheck,
    title: "25-year warranty",
    body: "BIS-certified panels and inverters built to perform for decades.",
  },
  {
    icon: Wrench,
    title: "Turnkey installation",
    body: "Site survey, design, DISCOM approvals and installation — all handled.",
  },
  {
    icon: Headset,
    title: "Lifetime support",
    body: "Dedicated service team and monitoring for the life of your system.",
  },
];

const stats = [
  { value: "25+", label: "Years of experience" },
  { value: "500+", label: "Products in catalogue" },
  { value: "10,000+", label: "Installations done" },
  { value: "4.8★", label: "Average customer rating" },
];

const systemSizes = ["1kW", "2kW", "3kW", "5kW", "7.5kW", "10kW"];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    address: siteConfig.address,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <Badge variant="secondary" className="gap-1.5">
              <Sun className="size-3.5" /> PM Surya Ghar subsidy available
            </Badge>
            <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              Power your home with <span className="text-primary">clean solar energy</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Genuine solar panels, inverters, batteries and complete rooftop systems. Cut your
              electricity bill by up to 90% with expert installation and subsidy support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
                Explore products <ArrowRight className="size-4" />
              </Link>
              <a
                href={whatsappLink("Hi, I want a free solar consultation")}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
              >
                Free consultation
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-primary" /> BIS certified
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-4 text-primary" /> Net metering
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> 25-yr warranty
              </span>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-sm">
            <Image
              src="https://picsum.photos/seed/solar-hero/1200/900"
              alt="Rooftop solar panel installation"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-1 text-muted-foreground">Everything you need for your solar journey.</p>
          </div>
          <Link href="/shop" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="relative size-16 overflow-hidden rounded-full bg-muted">
                <Image src={c.image_url ?? "https://picsum.photos/seed/solar/200/200"} alt={c.name} fill sizes="64px" className="object-cover" />
              </span>
              <span className="text-sm font-medium group-hover:text-primary">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Bestselling products
              </h2>
              <p className="mt-1 text-muted-foreground">Top-rated panels, inverters and systems.</p>
            </div>
            <Link href="/shop" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
              Shop all <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Why choose {siteConfig.name}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="h-full">
              <CardContent className="space-y-3 pt-6">
                <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-6" />
                </span>
                <h3 className="font-heading font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Systems by size */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Rooftop systems by size
          </h2>
          <p className="mt-1 text-muted-foreground">
            Subsidy-eligible on-grid kits for homes of every size.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {systemSizes.map((size) => (
              <Link
                key={size}
                href={`/shop?category=solar-systems&q=${size}`}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:text-primary"
              >
                <PanelsTopLeft className="size-4" /> {size} system
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Lead form */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              Get a free savings estimate
            </h2>
            <p className="text-muted-foreground">
              Tell us your monthly electricity bill and roof area — our experts will design the right
              system, calculate your savings and handle the subsidy paperwork.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                ["Free site survey", "A technician visits and measures your shadow-free roof area."],
                ["Custom system design", "We recommend the exact panel + inverter combination."],
                ["Subsidy & net metering", "We manage DISCOM approvals end to end."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <BatteryCharging className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">{title}</span> —{" "}
                    <span className="text-muted-foreground">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <LeadForm type="quote" title="Book a free consultation" submitLabel="Get my estimate" />
        </div>
      </section>
    </>
  );
}

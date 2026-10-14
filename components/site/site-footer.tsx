import Link from "next/link";
import { Mail, MapPin, Phone, Sun } from "lucide-react";
import { formatAddress, siteConfig, whatsappLink } from "@/lib/site";
import type { Category } from "@/lib/types";

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sun className="size-5" />
            </span>
            <span className="font-heading text-lg font-semibold">{siteConfig.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">{siteConfig.tagline}. Trusted solar panels, inverters, batteries and complete rooftop systems across India.</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Products</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Installation &amp; services</Link></li>
            <li><Link href="/subsidy" className="hover:text-foreground">PM Surya Ghar subsidy</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact us</Link></li>
            <li><Link href="/shop" className="hover:text-foreground">Shop all products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Get in touch</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <span>
                <a href={`tel:${siteConfig.salesPhone}`} className="block hover:text-foreground">Sales: {siteConfig.salesPhone}</a>
                <a href={`tel:${siteConfig.servicePhone}`} className="block hover:text-foreground">Service: {siteConfig.servicePhone}</a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">{siteConfig.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{formatAddress()}</span>
            </li>
            <li>
              <a href={whatsappLink("Hi, I have a solar enquiry")} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                Chat on WhatsApp →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p>Made in India · BIS certified products</p>
        </div>
      </div>
    </footer>
  );
}

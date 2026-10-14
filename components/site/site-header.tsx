"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Phone, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/site/cart-sheet";
import { UserMenu } from "@/components/auth/user-menu";
import type { Category, AuthUser } from "@/lib/types";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Installation" },
  { href: "/subsidy", label: "Subsidy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  categories,
  user,
}: {
  categories: Category[];
  user: AuthUser | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <span className="flex items-center gap-1.5">
            <Sun className="size-3.5" /> Rooftop solar with PM Surya Ghar subsidy — save up to 90% on bills
          </span>
          <div className="flex items-center gap-4">
            <a href={`tel:${siteConfig.salesPhone}`} className="flex items-center gap-1.5 hover:underline">
              <Phone className="size-3.5" /> {siteConfig.salesPhone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hover:underline">
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sun className="size-5" />
          </span>
          <span className="font-heading text-lg leading-none font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }))}>
              Products <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuItem render={<Link href="/shop" />}>All products</DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} render={<Link href={`/shop?category=${c.slug}`} />}>
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={cn(buttonVariants({ variant: "ghost" }))}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          <UserMenu user={user} />
          <a
            href={whatsappLink("Hi, I would like a solar quote")}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}
          >
            Get a quote
          </a>
          <Link href="/shop" className={cn(buttonVariants(), "hidden sm:inline-flex")}>
            Shop now
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
                <p className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase">
                  Products
                </p>
                <Link href="/shop" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  All products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                  >
                    {c.name}
                  </Link>
                ))}
                <p className="px-2 pt-3 pb-1 text-xs font-medium text-muted-foreground uppercase">Company</p>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                  >
                    {link.label}
                  </Link>
                ))}
                <p className="px-2 pt-3 pb-1 text-xs font-medium text-muted-foreground uppercase">
                  Account
                </p>
                <Link
                  href={user ? "/account" : "/login"}
                  className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                >
                  {user ? "My orders" : "Sign in"}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

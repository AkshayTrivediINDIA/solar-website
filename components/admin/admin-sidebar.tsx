"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Package, ShoppingBag, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b bg-card lg:h-screen lg:w-60 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {siteConfig.name.charAt(0)}
        </span>
        <span className="font-heading font-semibold">{siteConfig.name}</span>
      </div>

      <nav className="flex flex-1 flex-row gap-1 p-3 lg:flex-col">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <l.icon className="size-4" /> {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-row gap-1 border-t p-3 lg:flex-col">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4" /> View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}

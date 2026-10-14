import Link from "next/link";
import { Sun } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
        <Sun className="size-5" />
      </span>
      <span className="font-heading text-lg leading-none font-semibold tracking-tight">
        {siteConfig.name}
      </span>
    </Link>
  );
}

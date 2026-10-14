"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

export function UserMenu({ user }: { user: AuthUser | null }) {
  const router = useRouter();

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        aria-label="Sign in"
      >
        <UserIcon className="size-5" />
      </Link>
    );
  }

  const label = user.name || user.email || "My account";

  async function signOut() {
    const sb = createSupabaseBrowserClient();
    if (sb) await sb.auth.signOut();
    toast.success("Signed out");
    router.replace("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        aria-label="Account menu"
      >
        <UserIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <div className="truncate px-1.5 py-1 text-xs font-medium text-muted-foreground">
          {label}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <Package className="size-4" /> My orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banknote, CreditCard, Loader2, Lock, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cartSubtotal, useCartHydrated, useCartStore } from "@/lib/cart-store";
import { formatINR, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const schema = z.object({
  customer_name: z.string().min(2, "Please enter your full name"),
  customer_phone: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
  customer_email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address_line1: z.string().min(3, "Enter your address"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutView({
  razorpayEnabled,
  defaults,
}: {
  razorpayEnabled: boolean;
  defaults?: { customer_name?: string; customer_email?: string; customer_phone?: string };
}) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(items);
  const [method, setMethod] = useState<"cod" | "razorpay">(razorpayEnabled ? "razorpay" : "cod");
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: defaults?.customer_name ?? "",
      customer_email: defaults?.customer_email ?? "",
      customer_phone: defaults?.customer_phone ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          customer_email: values.customer_email || null,
          address_line2: values.address_line2 || null,
          notes: values.notes || null,
          payment_method: method,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Could not place order");
      }

      if (method === "cod") {
        clear();
        router.push(`/order/${data.orderNumber}`);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        throw new Error("Could not load the payment gateway. Please try again or use Cash on Delivery.");
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: siteConfig.name,
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: values.customer_name,
          email: values.customer_email || undefined,
          contact: values.customer_phone,
        },
        notes: { order_number: data.orderNumber },
        theme: { color: "#16a34a" },
        handler: async (response: Record<string, string>) => {
          try {
            const vr = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderNumber: data.orderNumber,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!vr.ok) throw new Error("Payment verification failed");
            clear();
            toast.success("Payment successful");
            router.push(`/order/${data.orderNumber}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info("Payment cancelled", {
              description: `Order ${data.orderNumber} is saved as pending.`,
            });
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setProcessing(false);
    }
  }

  if (!hydrated) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading checkout…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <Button nativeButton={false} render={<Link href="/shop" />}>Browse products</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Enter your delivery details to complete the order.
          </p>
        </div>

        <Card>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="customer_name">Full name *</Label>
              <Input id="customer_name" placeholder="Ramesh Kumar" {...register("customer_name")} />
              {errors.customer_name ? (
                <p className="text-xs text-destructive">{errors.customer_name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_phone">Phone *</Label>
              <Input id="customer_phone" inputMode="tel" placeholder="98765 43210" {...register("customer_phone")} />
              {errors.customer_phone ? (
                <p className="text-xs text-destructive">{errors.customer_phone.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_email">Email</Label>
              <Input id="customer_email" type="email" placeholder="you@example.com" {...register("customer_email")} />
              {errors.customer_email ? (
                <p className="text-xs text-destructive">{errors.customer_email.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="address_line1">Address *</Label>
              <Input id="address_line1" placeholder="House / street" {...register("address_line1")} />
              {errors.address_line1 ? (
                <p className="text-xs text-destructive">{errors.address_line1.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="address_line2">Landmark / area</Label>
              <Input id="address_line2" placeholder="Optional" {...register("address_line2")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" placeholder="Noida" {...register("city")} />
              {errors.city ? <p className="text-xs text-destructive">{errors.city.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State *</Label>
              <Input id="state" placeholder="Uttar Pradesh" {...register("state")} />
              {errors.state ? <p className="text-xs text-destructive">{errors.state.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input id="pincode" inputMode="numeric" placeholder="201301" {...register("pincode")} />
              {errors.pincode ? (
                <p className="text-xs text-destructive">{errors.pincode.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Order notes</Label>
              <Textarea id="notes" rows={2} placeholder="Any special instructions" {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <h2 className="font-heading font-semibold">Payment method</h2>

            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                method === "razorpay" ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                !razorpayEnabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type="radio"
                name="payment"
                className="accent-primary"
                checked={method === "razorpay"}
                disabled={!razorpayEnabled}
                onChange={() => setMethod("razorpay")}
              />
              <CreditCard className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Pay online (UPI / Card / Netbanking)</p>
                <p className="text-xs text-muted-foreground">Secure payment via Razorpay</p>
              </div>
            </label>

            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                method === "cod" ? "border-primary bg-primary/5" : "hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name="payment"
                className="accent-primary"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <Banknote className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when your order is delivered</p>
              </div>
            </label>

            {!razorpayEnabled ? (
              <p className="text-xs text-muted-foreground">
                Online payments are not enabled yet — Cash on Delivery is available.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-lg font-semibold">Order summary</h2>

          <div className="max-h-72 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <span className="line-clamp-2 font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatINR(item.price)} × {item.quantity}
                  </span>
                </div>
                <span className="text-sm font-medium">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Total payable</span>
            <span className="font-heading text-xl font-bold text-primary">{formatINR(subtotal)}</span>
          </div>

          <Button type="submit" size="lg" className="h-11 w-full" disabled={processing}>
            {processing ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {processing
              ? "Processing…"
              : method === "cod"
                ? "Place order (COD)"
                : `Pay ${formatINR(subtotal)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By placing an order you agree to our terms. Need help? Call {siteConfig.salesPhone}.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}

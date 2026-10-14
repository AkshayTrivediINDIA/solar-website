"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteConfig, whatsappLink } from "@/lib/site";
import type { LeadType } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LeadForm({
  type,
  productInterest,
  title = "Request a free quote",
  description = "Fill in your details and our solar expert will call you within 24 hours.",
  submitLabel = "Get my free quote",
  className,
}: {
  type: LeadType;
  productInterest?: string | null;
  title?: string;
  description?: string;
  submitLabel?: string;
  className?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          type,
          product_interest: productInterest ?? null,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      reset();
      toast.success("Thanks! We received your enquiry.");
    } catch {
      toast.error("Something went wrong. Please try WhatsApp or call us.");
    }
  }

  if (submitted) {
    return (
      <div className={cn("rounded-xl border bg-card p-6 text-center", className)}>
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h3 className="mt-3 font-heading text-lg font-semibold">Enquiry received</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Our team will contact you shortly. For a faster response, message us on WhatsApp.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <a
            href={whatsappLink(
              `Hi, I just submitted an enquiry${productInterest ? ` for ${productInterest}` : ""}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#25D366] px-4 text-sm font-medium text-white hover:bg-[#1ebe5b]"
          >
            Continue on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border bg-card p-6", className)}>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" placeholder="e.g. Ramesh Kumar" {...register("name")} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" inputMode="tel" placeholder="98765 43210" {...register("phone")} />
            {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Your city" {...register("city")} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={3}
            placeholder="Tell us about your requirement (roof size, monthly bill, etc.)"
            {...register("message")}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSubmitting ? "Sending..." : submitLabel}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Or call us at{" "}
          <a href={`tel:${siteConfig.salesPhone}`} className="font-medium text-foreground hover:underline">
            {siteConfig.salesPhone}
          </a>
        </p>
      </form>
    </div>
  );
}

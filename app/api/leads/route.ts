import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/data";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9+\-\s]{10,15}$/),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  city: z.string().optional().nullable(),
  type: z.enum(["quote", "contact", "dealership", "complaint"]),
  product_interest: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await createLead({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email ?? null,
    city: parsed.data.city ?? null,
    type: parsed.data.type,
    product_interest: parsed.data.product_interest ?? null,
    message: parsed.data.message ?? null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not save enquiry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

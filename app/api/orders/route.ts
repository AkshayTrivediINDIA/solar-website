import { NextResponse } from "next/server";
import { z } from "zod";
import { attachRazorpayOrder, createOrder, getOrderByNumber } from "@/lib/orders";
import { createRazorpayOrder, isRazorpayConfigured, razorpayKeyId } from "@/lib/razorpay";
import { getCurrentUser } from "@/lib/supabase/server";
import { sendOrderEmails } from "@/lib/email";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(999),
      }),
    )
    .min(1),
  customer_name: z.string().min(2),
  customer_phone: z.string().regex(/^[0-9+\-\s]{10,15}$/),
  customer_email: z.string().email().optional().or(z.literal("")).nullable(),
  address_line1: z.string().min(3),
  address_line2: z.string().optional().nullable(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().optional().nullable(),
  payment_method: z.enum(["razorpay", "cod"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
  }

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

  const data = parsed.data;

  if (data.payment_method === "razorpay" && !isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online payment is not configured yet. Please choose Cash on Delivery or contact us.",
      },
      { status: 503 },
    );
  }

  const result = await createOrder({
    ...data,
    user_id: user.id,
    customer_email: data.customer_email || user.email || null,
    address_line2: data.address_line2 || null,
    notes: data.notes || null,
  });

  if (!result.ok || !result.order) {
    return NextResponse.json({ error: result.error ?? "Could not create order" }, { status: 500 });
  }

  const order = result.order;

  if (data.payment_method === "cod") {
    const full = await getOrderByNumber(order.order_number);
    if (full) await sendOrderEmails(full);
    return NextResponse.json(
      { ok: true, orderNumber: order.order_number, orderId: order.id },
      { status: 201 },
    );
  }

  try {
    const rzp = await createRazorpayOrder({
      amount: Math.round(order.total * 100),
      receipt: order.order_number,
      notes: { order_number: order.order_number },
    });
    await attachRazorpayOrder(order.id, rzp.id);

    return NextResponse.json(
      {
        ok: true,
        orderNumber: order.order_number,
        orderId: order.id,
        razorpayOrderId: rzp.id,
        amount: rzp.amount,
        currency: rzp.currency,
        keyId: razorpayKeyId(),
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Payment initiation failed",
        orderNumber: order.order_number,
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrderByNumber, markOrderPaid } from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendOrderEmails } from "@/lib/email";

const schema = z.object({
  orderNumber: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
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
    return NextResponse.json({ error: "Invalid payment payload" }, { status: 422 });
  }

  const { orderNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const valid = verifyRazorpaySignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!valid) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await markOrderPaid(order.id, razorpay_payment_id);

  const paid = await getOrderByNumber(orderNumber);
  if (paid) await sendOrderEmails(paid);

  return NextResponse.json({ ok: true, orderNumber });
}

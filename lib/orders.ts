import { getAdminClient } from "./supabase";
import type { Order, OrderItem, OrderStatus, PaymentMethod } from "./types";

export type OrderInput = {
  items: { productId: string; quantity: number }[];
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  notes?: string | null;
  payment_method: PaymentMethod;
};

export function generateOrderNumber() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SS-${stamp}-${rand}`;
}

function normalizeOrder(row: Record<string, unknown>): Order {
  return {
    ...(row as unknown as Order),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
  };
}

export async function createOrder(
  input: OrderInput,
): Promise<{ ok: boolean; order?: Order; error?: string }> {
  const sb = getAdminClient();
  if (!sb) return { ok: false, error: "Ordering is not available right now." };

  if (!input.items.length) return { ok: false, error: "Your cart is empty." };

  const ids = input.items.map((i) => i.productId);
  const { data: products, error: prodErr } = await sb
    .from("products")
    .select("id,name,price")
    .in("id", ids);

  if (prodErr) return { ok: false, error: prodErr.message };
  if (!products || products.length === 0) return { ok: false, error: "Products not found." };

  const byId = new Map(products.map((p) => [p.id as string, p]));

  const items: {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[] = [];

  for (const entry of input.items) {
    const p = byId.get(entry.productId);
    if (!p) continue;
    const quantity = Math.max(1, Math.floor(entry.quantity));
    const price = Number(p.price);
    items.push({
      product_id: p.id as string,
      name: p.name as string,
      price,
      quantity,
      subtotal: price * quantity,
    });
  }

  if (items.length === 0) return { ok: false, error: "No valid products in cart." };

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const shipping = 0;
  const total = subtotal + shipping;
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderErr } = await sb
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: input.user_id ?? null,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_email: input.customer_email ?? null,
      address_line1: input.address_line1,
      address_line2: input.address_line2 ?? null,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      notes: input.notes ?? null,
      subtotal,
      shipping,
      total,
      payment_method: input.payment_method,
      payment_status: "pending",
      status: "pending",
    })
    .select()
    .single();

  if (orderErr || !order) return { ok: false, error: orderErr?.message ?? "Could not create order." };

  const { error: itemsErr } = await sb
    .from("order_items")
    .insert(items.map((i) => ({ ...i, order_id: order.id })));

  if (itemsErr) {
    await sb.from("orders").delete().eq("id", order.id);
    return { ok: false, error: itemsErr.message };
  }

  return { ok: true, order: normalizeOrder(order) };
}

export async function attachRazorpayOrder(orderId: string, razorpayOrderId: string) {
  const sb = getAdminClient();
  if (!sb) return;
  await sb.from("orders").update({ razorpay_order_id: razorpayOrderId }).eq("id", orderId);
}

export async function markOrderPaid(orderId: string, razorpayPaymentId: string) {
  const sb = getAdminClient();
  if (!sb) return;
  await sb
    .from("orders")
    .update({
      payment_status: "paid",
      status: "confirmed",
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("id", orderId);
}

export async function getOrders(): Promise<Order[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => normalizeOrder(row));
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => {
    const order = normalizeOrder(row);
    if (Array.isArray(row.order_items)) {
      order.order_items = (row.order_items as Record<string, unknown>[]).map((i) => ({
        ...(i as unknown as OrderItem),
        price: Number(i.price),
        subtotal: Number(i.subtotal),
      }));
    }
    return order;
  });
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const sb = getAdminClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();
  if (error || !data) return null;

  const order = normalizeOrder(data);
  const { data: items } = await sb
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  order.order_items = (items ?? []).map((i) => ({
    ...(i as unknown as OrderItem),
    price: Number(i.price),
    subtotal: Number(i.subtotal),
  }));

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const sb = getAdminClient();
  if (!sb) return { ok: false, error: "Not configured" };
  const { error } = await sb.from("orders").update({ status }).eq("id", orderId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function getOrderStats() {
  const orders = await getOrders();
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + o.total, 0),
  };
}

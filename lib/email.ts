import { formatINR, siteConfig } from "./site";
import type { Order } from "./types";

const EMAIL_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function escapeHtml(value: string) {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (c) => map[c]);
}

async function sendEmail(params: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!key || !from || params.to.length === 0) {
    console.warn(`[email] skipped (not configured): ${params.subject}`);
    return false;
  }

  try {
    const res = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}

function money(value: number) {
  return formatINR(value);
}

function itemsTable(order: Order) {
  const rows = (order.order_items ?? [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;">${money(item.price)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;">${money(item.subtotal)}</td>
        </tr>`,
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0;">
      <thead>
        <tr style="background:#f3f4f6;text-align:left;">
          <th style="padding:8px 10px;text-align:left;">Item</th>
          <th style="padding:8px 10px;text-align:center;">Qty</th>
          <th style="padding:8px 10px;text-align:right;">Price</th>
          <th style="padding:8px 10px;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function totalsBlock(order: Order) {
  const shipping = order.shipping > 0 ? money(order.shipping) : "Free";
  return `
    <table style="width:100%;font-size:14px;">
      <tr><td style="padding:2px 0;color:#6b7280;">Subtotal</td><td style="text-align:right;">${money(order.subtotal)}</td></tr>
      <tr><td style="padding:2px 0;color:#6b7280;">Shipping</td><td style="text-align:right;">${shipping}</td></tr>
      <tr><td style="padding:6px 0;font-weight:700;border-top:1px solid #e5e7eb;">Total</td><td style="text-align:right;font-weight:700;border-top:1px solid #e5e7eb;">${money(order.total)}</td></tr>
    </table>`;
}

function addressBlock(order: Order) {
  const lines = [
    order.address_line1,
    order.address_line2,
    `${order.city}, ${order.state} ${order.pincode}`,
  ].filter(Boolean);
  return lines.map((l) => escapeHtml(l as string)).join("<br/>");
}

function wrapper(title: string, body: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
    <div style="background:#16a34a;padding:16px 20px;border-radius:10px 10px 0 0;">
      <h1 style="margin:0;font-size:18px;color:#ffffff;">${escapeHtml(siteConfig.name)}</h1>
      <p style="margin:2px 0 0;font-size:12px;color:#dcfce7;">${escapeHtml(title)}</p>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;padding:20px;">
      ${body}
    </div>
    <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;">
      ${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.salesPhone)} · ${escapeHtml(siteConfig.email)}
    </p>
  </div>`;
}

function paymentLabel(order: Order) {
  if (order.payment_method === "cod") return "Cash on Delivery";
  return `Online (Razorpay) · ${order.payment_status}`;
}

function adminHtml(order: Order) {
  const placedAt = new Date(order.created_at).toLocaleString("en-IN");
  const body = `
    <h2 style="margin:0 0 4px;font-size:16px;">New order received</h2>
    <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
      Order <strong>${escapeHtml(order.order_number)}</strong> · ${escapeHtml(placedAt)}
    </p>

    <table style="width:100%;font-size:14px;margin-bottom:8px;">
      <tr><td style="padding:3px 0;color:#6b7280;">Customer</td><td style="text-align:right;">${escapeHtml(order.customer_name)}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;">Phone</td><td style="text-align:right;">${escapeHtml(order.customer_phone)}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;">Email</td><td style="text-align:right;">${escapeHtml(order.customer_email ?? "—")}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;">Payment</td><td style="text-align:right;">${escapeHtml(paymentLabel(order))}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;">Status</td><td style="text-align:right;text-transform:capitalize;">${escapeHtml(order.status)}</td></tr>
    </table>

    <p style="margin:14px 0 2px;font-size:13px;color:#6b7280;">Delivery address</p>
    <p style="margin:0 0 14px;font-size:14px;">${addressBlock(order)}</p>

    ${itemsTable(order)}
    ${totalsBlock(order)}

    ${
      order.notes
        ? `<p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Notes</p>
           <p style="margin:2px 0 0;font-size:14px;">${escapeHtml(order.notes)}</p>`
        : ""
    }
  `;
  return wrapper("New order notification", body);
}

function customerHtml(order: Order) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:16px;">Thank you for your order, ${escapeHtml(order.customer_name)}!</h2>
    <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
      We&apos;ve received order <strong>${escapeHtml(order.order_number)}</strong>. Our team will contact you shortly to confirm.
    </p>

    ${itemsTable(order)}
    ${totalsBlock(order)}

    <table style="width:100%;font-size:14px;margin-top:14px;">
      <tr><td style="padding:3px 0;color:#6b7280;">Payment</td><td style="text-align:right;">${escapeHtml(paymentLabel(order))}</td></tr>
    </table>

    <p style="margin:14px 0 2px;font-size:13px;color:#6b7280;">Delivery address</p>
    <p style="margin:0 0 14px;font-size:14px;">${addressBlock(order)}</p>

    <p style="font-size:13px;color:#374151;">
      Questions? Call us at <a href="tel:${escapeHtml(siteConfig.salesPhone)}" style="color:#16a34a;">${escapeHtml(siteConfig.salesPhone)}</a>
      or reply to this email.
    </p>
  `;
  return wrapper("Order confirmation", body);
}

/**
 * Sends the full order details to the company inbox and a confirmation to the
 * customer. Safe no-op when email is not configured.
 */
export async function sendOrderEmails(order: Order) {
  const companyInbox = process.env.ORDER_NOTIFICATION_EMAIL || siteConfig.email;

  await Promise.all([
    sendEmail({
      to: [companyInbox],
      subject: `New order ${order.order_number} — ${money(order.total)}`,
      html: adminHtml(order),
      replyTo: order.customer_email ?? undefined,
    }),
    order.customer_email
      ? sendEmail({
          to: [order.customer_email],
          subject: `Order confirmed: ${order.order_number}`,
          html: customerHtml(order),
        })
      : Promise.resolve(false),
  ]);
}

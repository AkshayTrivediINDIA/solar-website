import { redirect } from "next/navigation";
import { CheckoutView } from "@/components/site/checkout-view";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const defaults = {
    customer_name: (user.user_metadata?.full_name as string | undefined) ?? "",
    customer_email: user.email ?? "",
    customer_phone: user.phone ? user.phone.replace(/^\+91/, "") : "",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <CheckoutView razorpayEnabled={isRazorpayConfigured()} defaults={defaults} />
    </div>
  );
}

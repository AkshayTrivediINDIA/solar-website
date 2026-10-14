import { CartView } from "@/components/site/cart-view";

export const metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <CartView />
    </div>
  );
}

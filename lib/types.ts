export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  short_description: string | null;
  description: string | null;
  price: number;
  mrp: number | null;
  unit: string;
  stock: number;
  wattage: number | null;
  capacity: string | null;
  featured: boolean;
  badge: string | null;
  images: string[];
  specs: ProductSpec[];
  created_at: string;
};

export type LeadType = "quote" | "contact" | "dealership" | "complaint";
export type LeadStatus = "new" | "contacted" | "won" | "lost";

// ---- Cart (client-side) ----

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
};

// ---- Orders ----

export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  type: LeadType;
  product_interest: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
};

// ---- Customer auth (Supabase Auth) ----

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

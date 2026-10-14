import { getPublicClient, getAdminClient } from "./supabase";
import { seedCategories, seedProducts } from "./seed-data";
import type { Category, Lead, LeadType, Product } from "./types";

type ProductRow = Omit<Product, "category_slug" | "category_name">;

async function loadCategories(): Promise<Category[]> {
  const sb = getPublicClient();
  if (sb) {
    const { data, error } = await sb
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length) return data as Category[];
  }
  return seedCategories;
}

async function loadProducts(): Promise<Product[]> {
  const sb = getPublicClient();
  if (sb) {
    const { data, error } = await sb
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length) {
      const categories = await loadCategories();
      const byId = new Map(categories.map((c) => [c.id, c]));
      return (data as ProductRow[]).map((p) => {
        const category = byId.get(p.category_id);
        return {
          ...p,
          category_slug: category?.slug ?? "uncategorized",
          category_name: category?.name ?? "Uncategorized",
        };
      });
    }
  }
  return seedProducts;
}

export async function getCategories(): Promise<Category[]> {
  return loadCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await loadCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export type ProductFilters = {
  category?: string;
  q?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
  maxPrice?: number;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let products = await loadProducts();

  if (filters.category) {
    products = products.filter((p) => p.category_slug === filters.category);
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.short_description ?? "").toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q),
    );
  }

  if (typeof filters.maxPrice === "number") {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case "price-asc":
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products = [...products].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
    default:
      products = [...products].sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return products;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await loadProducts();
  const sameCategory = products.filter(
    (p) => p.category_id === product.category_id && p.id !== product.id,
  );
  const others = products.filter(
    (p) => p.category_id !== product.category_id && p.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await loadProducts();
  return products.map((p) => p.slug);
}

export type LeadInput = {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  type: LeadType;
  product_interest?: string | null;
  message?: string | null;
};

export async function createLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const sb = getAdminClient();
  if (sb) {
    const { error } = await sb.from("leads").insert({
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      city: input.city ?? null,
      type: input.type,
      product_interest: input.product_interest ?? null,
      message: input.message ?? null,
      status: "new",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  // No database configured — log so the enquiry is not lost during local dev.
  console.info("[lead] (no Supabase configured)", input);
  return { ok: true };
}

export async function getLeads(): Promise<Lead[]> {
  const sb = getAdminClient();
  if (sb) {
    const { data, error } = await sb
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data as Lead[];
  }
  return [];
}

export async function getLeadStats() {
  const leads = await getLeads();
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    won: leads.filter((l) => l.status === "won").length,
  };
}

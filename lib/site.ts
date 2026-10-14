export const siteConfig = {
  name: "Surya Solar",
  legalName: "Surya Solar Solutions Pvt. Ltd.",
  tagline: "Powering India with Clean Solar Energy",
  description:
    "Surya Solar is a trusted manufacturer and supplier of solar panels, inverters, batteries and complete rooftop solar systems. Save up to 90% on your electricity bills with subsidy-backed solar solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  salesPhone: "+91-98765-43210",
  servicePhone: "+91-98765-43211",
  email: "sales@suryasolar.example",
  whatsapp: "918879730321",
  address: {
    line1: "Plot 42, Solar Industrial Estate",
    line2: "Sector 63, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    country: "India",
  },
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export const formatAddress = () =>
  `${siteConfig.address.line1}, ${siteConfig.address.line2}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.pincode}`;

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${siteConfig.whatsapp}${text}`;
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

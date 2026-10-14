import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LeadForm } from "@/components/site/lead-form";
import { Card, CardContent } from "@/components/ui/card";
import { formatAddress, siteConfig, whatsappLink } from "@/lib/site";

export const metadata = {
  title: "Contact Us",
  description: `Contact ${siteConfig.name} for solar quotes, installation, service and dealership enquiries.`,
};

export default function ContactPage() {
  const contactItems = [
    {
      icon: Phone,
      label: "Sales",
      value: siteConfig.salesPhone,
      href: `tel:${siteConfig.salesPhone}`,
    },
    {
      icon: Phone,
      label: "Service",
      value: siteConfig.servicePhone,
      href: `tel:${siteConfig.servicePhone}`,
    },
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: whatsappLink("Hi, I have a solar enquiry"),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Have a question about solar panels, pricing, subsidy or service? Our team is here to help.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactItems.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
                <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
                  <CardContent className="space-y-2 pt-6">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <c.icon className="size-5" />
                    </span>
                    <p className="text-xs font-medium text-muted-foreground uppercase">{c.label}</p>
                    <p className="font-medium">{c.value}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Head office</p>
                  <p className="text-sm text-muted-foreground">{formatAddress()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Working hours</p>
                  <p className="text-sm text-muted-foreground">
                    Monday – Saturday, 9:30 AM – 6:30 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <LeadForm
          type="contact"
          title="Send us a message"
          description="We usually respond within a few hours during working days."
          submitLabel="Send message"
        />
      </div>
    </div>
  );
}

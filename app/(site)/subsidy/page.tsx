import Link from "next/link";
import { IndianRupee, Landmark, Sun } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LeadForm } from "@/components/site/lead-form";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "PM Surya Ghar Subsidy",
  description:
    "Get up to ₹78,000 subsidy under PM Surya Ghar: Muft Bijli Yojana for residential rooftop solar. Learn eligibility, subsidy slabs and the application process.",
};

const slabs = [
  { size: "1 kW", subsidy: "₹30,000" },
  { size: "2 kW", subsidy: "₹60,000" },
  { size: "3 kW and above", subsidy: "₹78,000 (capped)" },
];

const faqs = [
  {
    q: "What is PM Surya Ghar: Muft Bijli Yojana?",
    a: "It is a Government of India scheme that provides a direct subsidy for installing residential rooftop solar systems, helping households reduce their electricity bills through free solar power.",
  },
  {
    q: "Who is eligible for the subsidy?",
    a: "Residential households with their own roof and a valid electricity connection are eligible. The subsidy is deposited directly into the applicant's bank account after installation and net metering.",
  },
  {
    q: "How much subsidy will I get?",
    a: "₹30,000 per kW for the first 2 kW (up to ₹60,000) and ₹18,000 for the 3rd kW, capped at ₹78,000 for systems of 3 kW and above.",
  },
  {
    q: "How long does the process take?",
    a: "From application to commissioning typically takes 2 to 6 weeks depending on your DISCOM and system size. The subsidy is usually credited within 30 days of commissioning.",
  },
];

export default function SubsidyPage() {
  return (
    <div>
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <Badge variant="secondary" className="gap-1.5">
            <Landmark className="size-3.5" /> Government scheme
          </Badge>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
            PM Surya Ghar: Muft Bijli Yojana
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get up to <span className="font-semibold text-primary">₹78,000</span> subsidy for your
            residential rooftop solar system and 300 units of free electricity every month.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              Check my eligibility
            </Link>
            <Link
              href="/shop?category=solar-systems"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
            >
              Subsidy-ready kits
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold tracking-tight">Subsidy structure</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {slabs.map((s) => (
            <div key={s.size} className="rounded-xl border bg-card p-6 text-center">
              <Sun className="mx-auto size-7 text-primary" />
              <p className="mt-3 font-heading text-xl font-bold">{s.size}</p>
              <p className="mt-1 flex items-center justify-center gap-1 text-primary">
                <IndianRupee className="size-4" />
                <span className="font-semibold">{s.subsidy.replace("₹", "")}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Direct bank transfer</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="font-heading text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <Accordion className="mt-6">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              We handle the subsidy for you
            </h2>
            <p className="text-muted-foreground">
              From portal registration to feasibility approval, installation, net metering and the
              final subsidy claim — our team manages every step so your subsidy reaches your bank
              account without delays.
            </p>
          </div>
          <LeadForm
            type="quote"
            title="Check your subsidy eligibility"
            description="Fill this form and our expert will calculate your subsidy and savings."
            submitLabel="Check eligibility"
          />
        </div>
      </section>
    </div>
  );
}

import { ClipboardCheck, FileCheck2, HardHat, PlugZap, Ruler, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/site/lead-form";

export const metadata = {
  title: "Installation & Services",
  description:
    "End-to-end rooftop solar installation: site survey, system design, DISCOM approvals, net metering and maintenance.",
};

const steps = [
  { icon: Ruler, title: "1. Free site survey", body: "We assess your roof area, shading and electricity load." },
  { icon: ClipboardCheck, title: "2. Custom design", body: "A system tailored to your needs, budget and subsidy eligibility." },
  { icon: FileCheck2, title: "3. Approvals & net metering", body: "We handle DISCOM paperwork and subsidy registration." },
  { icon: HardHat, title: "4. Installation", body: "Certified technicians install panels, inverter, wiring and safety gear." },
  { icon: PlugZap, title: "5. Commissioning", body: "System testing, grid synchronisation and net-meter installation." },
  { icon: Wrench, title: "6. After-sales service", body: "Monitoring, cleaning guidance and ongoing maintenance support." },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            Solar installation & services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From the first site visit to lifetime maintenance, our certified team manages your entire
            solar journey so you can switch to solar without any hassle.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.title}>
              <CardContent className="space-y-3 pt-6">
                <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="size-6" />
                </span>
                <h3 className="font-heading font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight">Book an installation</h2>
            <p className="text-muted-foreground">
              Tell us about your home, business or industry and our engineers will schedule a free
              survey and prepare a detailed proposal within 24-48 hours.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Residential, commercial & industrial (up to MW scale)</li>
              <li>• On-grid, off-grid and hybrid systems</li>
              <li>• Complete safety and quality compliance</li>
              <li>• Subsidy and financing guidance</li>
            </ul>
          </div>
          <LeadForm
            type="quote"
            title="Request a site survey"
            description="Share your details and we will get in touch to schedule a free survey."
            submitLabel="Book free survey"
          />
        </div>
      </section>
    </div>
  );
}

import { Factory, Leaf, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — trusted solar manufacturer and EPC company serving homes, businesses and industries across India.`,
};

const values = [
  { icon: Target, title: "Our mission", body: "Make clean, affordable solar energy accessible to every Indian home and business." },
  { icon: Leaf, title: "Sustainability", body: "Every installation reduces carbon emissions and dependence on fossil fuels." },
  { icon: Users, title: "Customer first", body: "Transparent pricing, honest advice and lifetime service support." },
  { icon: Factory, title: "Made in India", body: "Quality-first manufacturing aligned with the Make in India vision." },
];

const milestones = [
  { year: "2001", text: "Started as a small power-backup assembly unit." },
  { year: "2012", text: "Expanded into solar panels, inverters and batteries." },
  { year: "2018", text: "Crossed 5,000 rooftop installations nationwide." },
  { year: "2026", text: "500+ SKUs and a pan-India dealer & service network." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight">About {siteConfig.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {siteConfig.name} is a well-rounded leader in the solar energy and power backup industry —
            manufacturing and supplying solar panels, inverters, batteries and complete rooftop systems
            for homes, commercial and industrial customers across India.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent className="space-y-3 pt-6">
                <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="size-6" />
                </span>
                <h3 className="font-heading font-semibold">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-heading text-2xl font-bold tracking-tight">Our journey</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.year} className="border-l-2 border-primary/40 pl-4">
                <p className="font-heading text-xl font-bold text-primary">{m.year}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

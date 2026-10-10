import { Building2, ClipboardCheck, Users } from "lucide-react";
import { SectionHeader } from "./section-header";

const PRINCIPLES = [
  {
    icon: Building2,
    title: "Sent to the right department",
    description:
      "Requests are directed to the city team best suited to help, whether that is public works, parks, or sanitation.",
  },
  {
    icon: Users,
    title: "Handled by an available crew",
    description:
      "City staff can see incoming work and assign it to a qualified team with the capacity to respond.",
  },
  {
    icon: ClipboardCheck,
    title: "Progress stays visible",
    description:
      "You can check the request history and see updates as the city team works toward a resolution.",
  },
];

export function AutoAssignmentSection() {
  return (
    <section className="border-y border-border bg-muted/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="A clear path to resolution"
          title={
            <>
              The right city team,{" "}
              <span className="landing-text-gradient">
                without the runaround.
              </span>
            </>
          }
          sub="Requests reach the people responsible for the work, while you stay informed from submission to follow-up."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <principle.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

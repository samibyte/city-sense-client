import { CitySenseMark } from "@/components/landing/primitives";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeader } from "@/components/landing/section-header";

export default function AboutPage() {
  return (
    <div className="landing-scope dark relative min-h-screen bg-landing-bg font-sans text-landing-ink">
      <main className="relative">
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <CitySenseMark className="size-16" />
              <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-landing-ink sm:text-5xl">
                About City Sense
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-landing-muted">
                City Sense is a municipal operations platform built to connect
                residents, field crews, and city administrators in one
                transparent workflow.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "For residents",
                body: "Submit service requests, track their progress, and follow up without waiting on phone lines or office hours.",
              },
              {
                title: "For field crews",
                body: "Receive assignments, update status in the field, and hand off completed work to the city's records.",
              },
              {
                title: "For administrators",
                body: "Manage the service catalog, oversee requests, review resolver applications, and keep operations visible.",
              },
            ].map((card, index) => (
              <Reveal key={card.title} delay={index * 100}>
                <div className="landing-glass h-full rounded-xl border-landing-line p-6">
                  <h3 className="font-display text-lg font-semibold text-landing-ink">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-landing-muted">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Our mission"
              title="Municipal operations, made simpler"
              sub="We believe city services should be easy to request, quick to assign, and transparent from the resident who reports an issue to the crew that fixes it."
            />
          </Reveal>
        </section>
      </main>
    </div>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

const FAQS = [
  {
    question:
      "What is the difference between a Complaint and a Service Request?",
    answer:
      "A COMPLAINT is a report for civic infrastructure hazards (like potholes, ruptured water pipes, broken streetlights) that are free of charge and handled by municipal public works. A SERVICE_REQUEST is a specialized service from the municipal catalog (like commercial bulk waste removal, private tree pruning, or building inspections) which may have a defined municipal fee paid through Stripe Checkout.",
  },
  {
    question: "How does the Stripe payment process work for paid services?",
    answer:
      "When a citizen selects a fee-based service, the request enters a PENDING status and an official Stripe Checkout session is generated. Once payment is confirmed by Stripe, the system automatically transitions the request to SUBMITTED and pushes it to the auto-assignment queue. If checkout is interrupted, a fallback verification mechanism handles confirmation.",
  },
  {
    question: "How does the auto-assignment engine match resolvers?",
    answer:
      "The engine checks all approved resolvers belonging to the exact department and city of the request. It filters candidates based on current active workload (preventing technician overload) and skips any resolver with prior rejections on that ticket. If an eligible match exists, it dispatches the ticket immediately to their queue.",
  },
  {
    question: "What happens if a resolver rejects an assignment?",
    answer:
      "Resolvers have the autonomy to accept or decline assignments with an explanation (such as emergency unavailability or specialized equipment requirements). If rejected, the rejection is permanently logged in the request's audit history, the resolver's rejection counter increments, and the engine routes the ticket to the next eligible resolver or escalates to city administrators.",
  },
  {
    question: "How do field technicians join as approved resolvers?",
    answer:
      "Contractors and municipal technicians submit an application containing their name, contact details, specialty department, city, and resume/certifications uploaded to Cloudinary. City administrators review the application and, upon approval, the system generates initial credentials and dispatches access details via email.",
  },
  {
    question: "Can city administrators manually override or reassign requests?",
    answer:
      "Yes. City administrators have full control over the central operations grid. They can manually assign or reassign any ticket across departments and cities, update request statuses with mandatory audit notes, adjust priorities (HIGH, MEDIUM, LOW), and manage resolver account statuses (ACTIVE, BANNED, DELETED).",
  },
  {
    question: "How is citizen feedback collected after resolution?",
    answer:
      "When a resolver marks a ticket COMPLETED with attached proof files and notes, the reporting citizen is notified to review the work. The citizen submits a 1–5 star rating and optional comments. This feedback is permanently tied to the request record and visible to municipal administrators.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Platform Operations FAQ"
            title={
              <>
                Common questions about{" "}
                <span className="landing-text-gradient">
                  how City Sense operates.
                </span>
              </>
            }
            sub="Accurate operational details on request routing, payments, auto-assignment logic, and administrative governance."
          />
        </Reveal>

        <div className="mt-14">
          <Reveal delay={120}>
            <GlassCard
              tone="deep"
              className="rounded-3xl border border-landing-line p-6 sm:p-8"
            >
              <Accordion className="space-y-4">
                {FAQS.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`item-${index}`}
                    className="rounded-2xl border border-landing-line/60 bg-black/30 px-5 py-2 transition-colors data-[state=open]:border-emerald-500/40 data-[state=open]:bg-black/50"
                  >
                    <AccordionTrigger className="text-left font-display text-sm sm:text-base font-semibold text-landing-ink hover:text-emerald-300 py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-landing-muted leading-relaxed pb-4 pt-1">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

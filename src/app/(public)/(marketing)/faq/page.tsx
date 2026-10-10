import { Reveal } from "@/components/landing/reveal";
import { SectionHeader } from "@/components/landing/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What is City Sense?",
    answer:
      "City Sense is a municipal operations platform that brings citizen service requests, field crew assignments, and city administration into one transparent place. It is built for residents, field crews, and city administrators.",
  },
  {
    question: "Who can use City Sense?",
    answer:
      "Anyone can browse the public catalog. Citizens create an account to submit and track service requests. Field crews and administrators sign in through their own portals to handle assignments and operations.",
  },
  {
    question: "How do I submit a service request?",
    answer:
      "Create a citizen account, open the service catalog, pick the service you need, and submit the request with your location and any supporting details. You can track its status from your dashboard.",
  },
  {
    question: "What kinds of services are available?",
    answer:
      "The catalog covers common municipal services such as pothole reports, streetlight outages, illegal dumping, park maintenance, and permit inquiries. New categories can be added by city administrators.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "We use secure authentication and only store the information required to process your requests. Access is role-based, so field crews and administrators only see what their job requires.",
  },
  {
    question: "What do I do if a request is not resolved?",
    answer:
      "Open your dashboard and follow up on the request. If it remains stuck, contact us through the Contact page and we will escalate it to the right team.",
  },
];

export default function FaqPage() {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <main className="relative">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Help center"
              title="Frequently asked questions"
              sub="Find answers about using City Sense, submitting requests, and how your data is handled."
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-12">
              <Accordion defaultValue={["item-0"]} className="w-full">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`item-${index}`}
                    className="landing-glass mb-4 rounded-xl border-landing-line px-5"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold text-landing-ink hover:text-landing-brand">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-landing-muted">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

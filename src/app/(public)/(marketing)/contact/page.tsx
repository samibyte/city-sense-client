import { Reveal } from "@/components/landing/reveal";
import { SectionHeader } from "@/components/landing/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <main className="relative">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Get in touch"
              title="Contact City Sense"
              sub="Have a question, a request that needs a follow-up, or feedback to share? Send us a message and we will get back to you."
            />
          </Reveal>

          <Reveal delay={100}>
            <form className="mt-12 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-landing-muted"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="landing-glass-chip h-11 border-landing-line-strong bg-transparent text-landing-ink placeholder:text-landing-faint"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-landing-muted"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="landing-glass-chip h-11 border-landing-line-strong bg-transparent text-landing-ink placeholder:text-landing-faint"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-landing-muted"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  className="landing-glass-chip h-11 border-landing-line-strong bg-transparent text-landing-ink placeholder:text-landing-faint"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-landing-muted"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more..."
                  className="landing-glass-chip min-h-[120px] border-landing-line-strong bg-transparent text-landing-ink placeholder:text-landing-faint"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 gap-2 px-6 text-[15px] font-semibold shadow-[0_14px_36px_-10px_rgba(52,211,153,0.6)]"
                >
                  Send message
                </Button>
              </div>
            </form>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

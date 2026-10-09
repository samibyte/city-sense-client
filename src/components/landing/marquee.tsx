import type { LucideIcon } from "lucide-react";
import {
  Camera,
  CircleDot,
  Droplets,
  FileText,
  Lightbulb,
  Truck,
  Wrench,
} from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Wrench, label: "Pothole Repair" },
  { icon: Droplets, label: "Water Leak" },
  { icon: Lightbulb, label: "Broken Lighting" },
  { icon: Truck, label: "Bulk Pickup" },
  { icon: Camera, label: "Photo Evidence" },
  { icon: FileText, label: "Service Request" },
  { icon: CircleDot, label: "Civic Complaint" },
];

/** Infinite ticker of the issue types the platform handles. */
export function IssueMarquee() {
  return (
    <section
      aria-labelledby="issue-types-heading"
      className="border-y border-landing-line bg-white/[0.02]"
    >
      <h2 id="issue-types-heading" className="sr-only">
        Issue types handled by City Sense
      </h2>
      <ul className="sr-only">
        {ITEMS.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>

      <div className="landing-marquee-mask group overflow-hidden py-5">
        <div
          aria-hidden
          className="flex w-max animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span
              key={`${item.label}-${i}`}
              className="flex items-center gap-2.5 rounded-full border border-landing-line bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-landing-muted backdrop-blur-sm"
            >
              <item.icon className="size-4 text-emerald-400/70" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

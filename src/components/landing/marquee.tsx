import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Droplets,
  HardHat,
  Lightbulb,
  Trees,
  Truck,
  Wrench,
} from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Wrench, label: "Road Infrastructure & Potholes" },
  { icon: Droplets, label: "Main Water Pipeline Leaks" },
  { icon: Lightbulb, label: "Streetlight Outages & Junctions" },
  { icon: Truck, label: "Bulk Waste & Debris Hauling" },
  { icon: Trees, label: "Hazardous Tree Pruning" },
  { icon: HardHat, label: "Municipal Drainage Clearances" },
  { icon: AlertTriangle, label: "Traffic Signal Malfunctions" },
];

/** A quick overview of the kinds of work residents can raise with the city. */
export function IssueMarquee() {
  return (
    <section
      aria-labelledby="issue-types-heading"
      className="border-y border-border bg-muted/50"
    >
      <h2 id="issue-types-heading" className="sr-only">
        City services and issues
      </h2>
      <ul className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-4 px-4 py-6 text-sm font-medium text-foreground sm:px-6 lg:px-8">
        {ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <item.icon className="size-4 text-primary" />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

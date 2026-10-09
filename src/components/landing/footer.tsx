import Link from "next/link";
import { CitySenseMark } from "./primitives";
import { Reveal } from "./reveal";

const COLUMNS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Platform",
    links: [
      { label: "Citizen dashboard", href: "/dashboard" },
      { label: "My requests", href: "/dashboard/my-requests" },
      { label: "Service catalog", href: "/dashboard/services" },
      { label: "New request", href: "/dashboard/requests/new" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Citizen portal", href: "/dashboard" },
      { label: "Resolver assignments", href: "/resolver/assignments" },
      { label: "Admin operations", href: "/admin/requests" },
      { label: "Service management", href: "/admin/services" },
    ],
  },
  {
    title: "Access",
    links: [
      { label: "Sign in", href: "/auth" },
      { label: "Create account", href: "/auth" },
      { label: "Verify account", href: "/auth" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-landing-line bg-landing-bg-deep/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <CitySenseMark className="size-9" />
              <span className="flex flex-col">
                <span className="font-display text-[17px] font-semibold leading-none tracking-tight text-landing-ink">
                  City Sense
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-landing-faint">
                  Municipal Operations
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-landing-muted">
              Citizen services, requests and resolutions in one transparent
              place — built for residents, field crews and city administrators.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-landing-faint">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-landing-muted transition-colors hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-landing-line pt-7 sm:flex-row">
            <p className="text-xs text-landing-faint">
              © {new Date().getFullYear()} City Sense. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-xs text-landing-faint">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Municipal Operations Platform
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

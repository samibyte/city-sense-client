import { Building2 } from "lucide-react";
import Link from "next/link";

const COLUMNS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "City services",
    links: [
      { label: "Browse services", href: "/service" },
      { label: "Submit a request", href: "/dashboard/requests/new" },
      { label: "Track a request", href: "/dashboard/my-requests" },
    ],
  },
  {
    title: "For city teams",
    links: [
      { label: "Resolver portal", href: "/resolver/assignments" },
      { label: "Administration", href: "/admin/requests" },
      { label: "Service categories", href: "/admin/categories" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About City Sense", href: "/about" },
      { label: "Frequently asked questions", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/60 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="size-5" />
              </span>
              <span className="font-semibold tracking-tight text-foreground">
                City Sense
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A clearer way for residents to reach city teams, request public
              services, and follow progress through to resolution.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-5 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} City Sense</p>
        </div>
      </div>
    </footer>
  );
}

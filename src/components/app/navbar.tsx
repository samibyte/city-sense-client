"use client";

import { Building2, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";
import { dashboardPathByRole } from "@/routes";

const menuItems = [
  { name: "Services", href: "/service" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useGetMe();
  const user = data?.data;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-30">
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 top-0 border-b border-border bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/90"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="City Sense home"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5 rounded-md text-foreground"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </span>
            <span className="font-semibold tracking-tight">City Sense</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <div
            className={cn(
              "absolute inset-x-0 top-full border-b border-border bg-background px-4 pb-5 pt-3 shadow-md lg:static lg:flex lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
              menuOpen ? "block" : "hidden lg:flex",
            )}
          >
            <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-7">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground lg:px-0 lg:py-1 lg:hover:bg-transparent",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:mt-0 lg:ml-auto">
              {user ? (
                <Button
                  render={<Link href={dashboardPathByRole[user.role]} />}
                  onClick={closeMenu}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Open dashboard
                </Button>
              ) : (
                <>
                  <Button
                    render={<Link href="/auth" />}
                    onClick={closeMenu}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Sign in
                  </Button>
                  <Button
                    render={<Link href="/auth" />}
                    onClick={closeMenu}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Create an account
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div aria-hidden className="h-[65px]" />
    </header>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useGetMe } from "@/hooks";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const pathname = usePathname();
  const { data } = useGetMe();
  const user = data?.data;

  // Breadcrumb segment readable label
  const segments = pathname.split("/").filter(Boolean);
  const currentTitle =
    segments.length > 1
      ? segments[segments.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/70 px-4 backdrop-blur-md transition-all">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground tracking-tight">
            {currentTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "CITIZEN" && (
          <Button
            render={<Link href="/dashboard/requests/new" />}
            size="sm"
            className="h-8 gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Request</span>
          </Button>
        )}
      </div>
    </header>
  );
}

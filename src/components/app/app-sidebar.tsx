"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  CheckSquare,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Sparkles,
  Tag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { getRoutesForRole } from "@/routes";
import type { UserRole } from "@/types";

/* ---------- icon registry ---------- */

const ROUTE_ICONS: Record<string, React.ElementType> = {
  Overview: LayoutDashboard,
  Dashboard: LayoutDashboard,
  Requests: ClipboardList,
  "My Requests": ClipboardList,
  "New Request": Plus,
  Profile: User,
  Services: Package,
  Categories: Tag,
  Users: Users,
  "Resolver Applications": FileCheck,
  "My Assignments": CheckSquare,
};

/* ---------- role meta ---------- */

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Administrator",
  RESOLVER: "Field Resolver",
  CITIZEN: "Citizen",
};

const ROLE_DOT: Record<UserRole, string> = {
  ADMIN: "bg-primary",
  RESOLVER: "bg-secondary",
  CITIZEN: "bg-accent",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/* ---------- component ---------- */

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetMe();
  const { mutate: logout } = useLogout();

  const user = data?.data;
  const routes = user ? getRoutesForRole(user.role) : [];

  function handleLogout() {
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear();
        router.push("/auth");
      },
      onError: () => {
        queryClient.clear();
        router.push("/auth");
      },
    });
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      {/* brand */}
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold leading-tight">
              City Sense
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Services Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* nav */}
      <SidebarContent className="px-2 py-2">
        {routes.map((group) => (
          <SidebarGroup key={group.title} className="py-1">
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = ROUTE_ICONS[item.title] ?? LayoutDashboard;
                const isActive =
                  pathname === item.url ||
                  (!["Dashboard", "Overview"].includes(item.title) &&
                    item.url !== "/" &&
                    pathname.startsWith(`${item.url}/`));
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "rounded-lg",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* user + logout */}
      <SidebarFooter className="p-3">
        {user && (
          <div className="flex items-center gap-2.5 px-1 py-2 group-data-[collapsible=icon]:justify-center">
            <div className="relative shrink-0">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={user.profileUrl ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar",
                  ROLE_DOT[user.role],
                )}
              />
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium leading-tight">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Log out"
              className="rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

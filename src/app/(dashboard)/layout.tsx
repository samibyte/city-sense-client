import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import AppSidebar from "@/components/app/app-sidebar";
import AppHeader from "@/components/app/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 flex flex-col bg-background/50">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

import type { ReactNode } from "react";
import { Navbar } from "@/components/app/navbar";
import { Footer } from "@/components/landing/footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing-scope flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

interface LayoutProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "City Sense",
  description: "Citizen services, requests and payments in one place.",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        spaceGrotesk.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}

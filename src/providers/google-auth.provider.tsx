"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Always mount the provider so components that render `GoogleLogin`
  // (even just to read context during prerender) don't throw when the
  // client ID is not configured at build time.
  return (
    <GoogleOAuthProvider clientId={clientId ?? ""}>
      {children}
    </GoogleOAuthProvider>
  );
}

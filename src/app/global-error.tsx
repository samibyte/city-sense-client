"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { FeedbackScreen } from "@/components/shared";
import { Button } from "@/components/ui/button";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <FeedbackScreen
          eyebrow="Fatal error"
          title="The application failed to load"
          description={
            <>
              <p>
                {error.message ||
                  "Something went wrong while starting the app. Please reload the page or try again."}
              </p>
              {error.digest && (
                <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                  Reference: {error.digest}
                </p>
              )}
            </>
          }
          icon={<TriangleAlert className="size-6" />}
          action={
            <Button onClick={() => retry()}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
          }
        />
      </body>
    </html>
  );
}

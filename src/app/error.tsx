"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { FeedbackScreen } from "@/components/shared";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FeedbackScreen
      eyebrow="Something went wrong"
      title="We hit an unexpected error"
      description={
        <>
          <p>
            {error.message ||
              "An unexpected error occurred while rendering this page. You can try again or head back home."}
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
        <>
          <Button onClick={() => retry()}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button variant="outline" render={<Link href="/" />}>
            Back to home
          </Button>
        </>
      }
    />
  );
}

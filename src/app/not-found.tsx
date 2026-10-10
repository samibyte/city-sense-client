import { Compass } from "lucide-react";
import Link from "next/link";
import { FeedbackScreen } from "@/components/shared";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <FeedbackScreen
      eyebrow="404"
      title="This page could not be found"
      description="The page you are looking for may have been moved, renamed, or never existed. Let’s get you back on track."
      icon={<Compass className="size-6" />}
      action={
        <>
          <Button render={<Link href="/" />}>Back to home</Button>
          <Button variant="outline" render={<Link href="/service" />}>
            Browse city services
          </Button>
        </>
      }
    />
  );
}

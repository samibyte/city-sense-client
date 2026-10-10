import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  label?: string;
  className?: string;
}

export function LoadingScreen({
  label = "Loading…",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground",
        className,
      )}
    >
      <Spinner className="size-6 text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

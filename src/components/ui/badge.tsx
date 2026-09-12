import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

/** Category / tag pill. Non-interactive by design — filters use buttons. */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

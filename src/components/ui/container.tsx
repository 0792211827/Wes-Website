import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

/** The site's single horizontal rhythm: one max width, one set of gutters. */
export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  /** `prose` is narrower, for long-form reading measure. */
  width?: "default" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "prose" ? "max-w-2xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

import { cn } from "@phunq/utils";
import { CSSProperties } from "react";

export function GradientBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={
        {
          "--background": "0 0 0",
          "--highlight": "91 91 91",

          "--bg-color":
            "linear-gradient(rgb(var(--background)), rgb(var(--background)))",
          "--border-color": `linear-gradient(190deg,
              rgb(var(--highlight) / 1) 0%,
              rgb(var(--highlight) / 0.3) 33.33%,
              rgb(var(--highlight) / 0.3) 66.67%,
              rgb(var(--highlight) / 0.3) 66.67%)
            `,
        } as CSSProperties
      }
      className={cn(
        "w-full rounded-md border border-zinc-200 dark:border dark:border-transparent dark:[background:padding-box_var(--bg-color),border-box_var(--border-color)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

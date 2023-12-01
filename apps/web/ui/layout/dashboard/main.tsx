import { cn } from "@phunq/utils";
import * as React from "react";

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Main({ children, className, ...props }: MainProps) {
  return (
    <>
      <div className={cn("mx-auto flex max-w-5xl px-6", className)} {...props}>
        {children}
      </div>
    </>
  );
}

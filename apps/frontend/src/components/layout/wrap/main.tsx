import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const PageWrap = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-4 py-4", className)}>
      {children}
    </div>
  );
};

export default PageWrap;

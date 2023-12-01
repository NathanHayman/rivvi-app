import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const ModuleWrap = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 lg:px-6", className)}>
      {children}
    </div>
  );
};

export default ModuleWrap;

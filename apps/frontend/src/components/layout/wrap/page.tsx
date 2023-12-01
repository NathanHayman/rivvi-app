import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const MainWrap = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-2", className)}
    >
      {children}
    </div>
  );
};

export default MainWrap;

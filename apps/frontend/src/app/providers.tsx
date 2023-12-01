"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <Toaster closeButton richColors />
      {children}
    </NextUIProvider>
  );
}

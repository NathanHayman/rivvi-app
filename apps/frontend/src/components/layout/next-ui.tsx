"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Suspense } from "react";

export default function NextUI({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Suspense>{children}</Suspense>
    </NextUIProvider>
  );
}

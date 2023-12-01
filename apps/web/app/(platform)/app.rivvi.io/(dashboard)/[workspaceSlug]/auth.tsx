"use client";

import { ReactNode } from "react";

import useWorkspace from "@/lib/swr/use-workspace";
import LayoutLoader from "@/ui/layout/layout-loader";
import WorkspaceNotFound from "@/ui/workspaces/workspace-not-found";

export default function WorkspaceAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useWorkspace();

  if (loading) {
    return <LayoutLoader />;
  }

  if (error) {
    return <WorkspaceNotFound />;
  }

  return children;
}

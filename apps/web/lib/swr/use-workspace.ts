import { fetcher } from "@phunq/utils";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { WorkspaceProps } from "@/lib/types";

export default function useWorkspace() {
  const { workspaceSlug } = useParams() as { workspaceSlug?: string };

  const { data: workspace, error } = useSWR<WorkspaceProps>(
    workspaceSlug && `/api/workspaces/${workspaceSlug}`,
    fetcher,
    {
      dedupingInterval: 30000,
    },
  );

  const exceededUsage = useMemo(() => {
    if (workspace) {
      return workspace.usage > workspace.usageLimit;
    }
  }, [workspace]);

  return {
    ...workspace,
    isOwner: workspace?.users && workspace.users[0].role === "OWNER",
    exceededUsage,
    error,
    loading: workspaceSlug && !workspace && !error,
  };
}

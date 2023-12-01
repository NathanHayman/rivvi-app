import { fetcher } from "@phunq/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";

import { UserProps } from "@/lib/types";

export default function useUsers({ invites }: { invites?: boolean } = {}) {
  const { workspaceSlug } = useParams() as {
    workspaceSlug: string;
  };

  const { data: users, error } = useSWR<UserProps[]>(
    workspaceSlug &&
      (invites
        ? `/api/workspaces/${workspaceSlug}/invites`
        : `/api/workspaces/${workspaceSlug}/users`),
    fetcher,
  );

  return {
    users,
    loading: !error && !users,
  };
}

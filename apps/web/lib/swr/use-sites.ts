import { fetcher } from "@phunq/utils";
import { type Site as SiteProps } from "@prisma/client";
import { useParams } from "next/navigation";
import useSWR from "swr";

import { UserProps } from "@/lib/types";

export default function useSites() {
  const { id, workspaceSlug } = useParams() as {
    id: string;
    workspaceSlug?: string;
  };
  const { data: sites, isValidating } = useSWR<
    (SiteProps & {
      user: UserProps;
    })[]
  >(
    `/api${workspaceSlug ? `/workspaces/${workspaceSlug}` : ""}/sites${id} `,
    fetcher,
    {
      dedupingInterval: 20000,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  return {
    sites,
    loading: sites ? false : true,
    isValidating,
  };
}

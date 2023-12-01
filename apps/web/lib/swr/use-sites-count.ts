import { fetcher, getQueryString } from "@phunq/utils";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function useSitesCount({
  groupBy,
}: {
  groupBy?: "domain";
} = {}) {
  const pathname = usePathname();
  const { workspaceSlug } = useParams() as { workspaceSlug?: string };
  const searchParams = useSearchParams();

  const { data, error } = useSWR<any>(
    `/api${workspaceSlug ? `/workspaces/${workspaceSlug}` : ""}/sites/count${
      // only include query params if we're on the workspace funnels page
      pathname === `/${workspaceSlug}` || pathname === "/sites"
        ? getQueryString({
            searchParams,
            ...(groupBy && { groupBy }),
          })
        : ""
    }`,
    fetcher,
    {
      dedupingInterval: 30000,
      keepPreviousData: true,
    },
  );

  return {
    data,
    loading: !error && !data,
    error,
  };
}

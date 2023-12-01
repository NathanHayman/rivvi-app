import { fetcher } from "@phunq/utils";
import useSWR from "swr";

import { DomainResponse, DomainVerificationStatusProps } from "@/lib/types";

export function useDomainStatus({
  domain,
  workspaceSlug,
}: {
  domain: string;
  workspaceSlug: string;
}) {
  const { data, isValidating } = useSWR<{
    status: DomainVerificationStatusProps;
    domainJson: DomainResponse & { error: { code: string; message: string } };
  }>(`/api/workspaces/${workspaceSlug}/domains/${domain}/verify`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 5000,
    keepPreviousData: true,
  });

  return {
    status: data?.status,
    domainJson: data?.domainJson,
    loading: isValidating,
  };
}

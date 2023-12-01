import { fetcher } from "@phunq/utils";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { DomainProps } from "@/lib/types";

export default function useDomains({ domain }: { domain?: string } = {}) {
  const { workspaceSlug } = useParams() as {
    workspaceSlug: string;
  };

  const { data, error } = useSWR<DomainProps[]>(
    workspaceSlug && `/api/workspaces/${workspaceSlug}/domains`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  const domains = useMemo(() => {
    return workspaceSlug
      ? data
      : ([
          {
            slug: "youtube",
            verified: true,
            primary: true,
          },
        ] as DomainProps[]);
  }, [data, workspaceSlug]);

  return {
    domains,
    primaryDomain:
      domains?.find((domain) => domain.primary)?.slug ||
      (domains && domains.length > 0 && domains[0].slug),
    verified: domain
      ? // If a domain is passed, check if it's verified
        domains?.find((d) => d.slug === domain)?.verified
      : // If no domain is passed, check if any of the domains are verified
        domains?.some((d) => d.verified),
    loading: !domains && !error,
    error,
  };
}

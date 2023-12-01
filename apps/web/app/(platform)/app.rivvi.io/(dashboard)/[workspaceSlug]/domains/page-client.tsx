"use client";

import { InfoTooltip, TooltipContent } from "@phunq/ui";
import { HOME_DOMAIN } from "@phunq/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import useDomains from "@/lib/swr/use-domains";
import useWorkspace from "@/lib/swr/use-workspace";
import DomainCard from "@/ui/domains/domain-card";
import DomainCardPlaceholder from "@/ui/domains/domain-card-placeholder";
import NoDomainsPlaceholder from "@/ui/domains/no-domains-placeholder";
import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";
import { useAddEditDomainModal } from "@/components/modal/add-edit-domain-modal";
import { useAddEditFunnelModal } from "@/ui/modals/add-edit-funnel-modal";

export default function WorkspaceDomainsClient() {
	const { id: workspaceId } = useWorkspace();

	const {
		AddEditDomainModal,
		setShowAddEditDomainModal,
		AddEditDomainButton,
	} = useAddEditDomainModal();
	const { setShowAddEditFunnelModal } = useAddEditFunnelModal();
	const { domains } = useDomains();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams?.get("modal") === "true") {
			// set body pointer events to the opposite of none
			document.body.style.pointerEvents = "auto";
			setShowAddEditDomainModal(true);
		}
	}, [searchParams, setShowAddEditDomainModal]);

	return (
		<>
			{workspaceId && <AddEditDomainModal />}
			<Shell>
				<Header heading="">
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center space-x-2">
							<h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.416px]">
								Domains
							</h1>
							<InfoTooltip
								content={
									<TooltipContent
										title="Learn more about how to add, configure, and verify custom domains on Phunq."
										href={`${HOME_DOMAIN}/help/article/how-to-add-custom-domain`}
										target="_blank"
										cta="Learn more"
									/>
								}
							/>
						</div>
						<AddEditDomainButton />
					</div>
				</Header>
				<Main>
					{domains ? (
						domains.length > 0 ? (
							<ul className="mt-8 grid w-full grid-cols-1 gap-3">
								{domains.map((domain) => (
									<li key={domain.slug}>
										<DomainCard props={domain} />
									</li>
								))}
							</ul>
						) : (
							<NoDomainsPlaceholder AddEditDomainButton={AddEditDomainButton} />
						)
					) : (
						<DomainCardPlaceholder />
					)}
				</Main>
			</Shell>
		</>
	);
}

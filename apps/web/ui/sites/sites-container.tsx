"use client";

import { Suspense } from "react";
import SiteCard from "./site-card";
import SiteCardPlaceholder from "./site-card-placeholder";
import SitePagination from "./site-pagination";
import SiteSort from "./site-sort";
import NoFunnelsPlaceholder from "./no-sites-placeholder";
import { useSiteFiltersModal } from "@/components/modal/site-filters-modal";

export default function SitesContainer({
	AddEditSiteButton,
	sites,
}: {
	AddEditSiteButton: JSX.Element | (() => JSX.Element);
	sites: any;
}) {
	const { SiteFiltersButton, SiteFiltersModal } = useSiteFiltersModal();

	return (
		<>
			<SiteFiltersModal />
			<div className="flex w-full flex-col justify-center">
				<div className="my-5 flex h-10 w-full justify-center lg:justify-end">
					<SiteFiltersButton />
					<Suspense>
						<SiteSort />
					</Suspense>
				</div>
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
					<div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
						<ul className="grid min-h-[66.5vh] auto-rows-min gap-3">
							{sites ? (
								sites.length > 0 ? (
									sites.map((props) => (
										<Suspense key={props.id} fallback={<SiteCardPlaceholder />}>
											<SiteCard props={props} />
										</Suspense>
									))
								) : (
									<NoFunnelsPlaceholder
										AddEditSiteButton={AddEditSiteButton as any}
									/>
								)
							) : (
								Array.from({ length: 10 }).map((_, i) => (
									<SiteCardPlaceholder key={i} />
								))
							)}
						</ul>
						{sites && sites.length > 0 && (
							<Suspense>
								<SitePagination />
							</Suspense>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

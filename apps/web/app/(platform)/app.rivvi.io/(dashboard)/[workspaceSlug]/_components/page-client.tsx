"use client";

import SitesContainer from "@/ui/sites/sites-container";
import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";
import { useAddEditSiteModal } from "@/components/modal/add-edit-site-modal";

export default function WorkspaceFunnelsClient({ sites }: { sites: any }) {
	const { AddEditSiteModal, AddEditSiteButton } = useAddEditSiteModal();

	return (
		<>
			<AddEditSiteModal />
			<Shell>
				<Header heading="Funnels">
					<div className="flex-end flex gap-2">
						<AddEditSiteButton />
					</div>
				</Header>
				<Main>
					<SitesContainer sites={sites} AddEditSiteButton={AddEditSiteButton} />
				</Main>
			</Shell>
		</>
	);
}

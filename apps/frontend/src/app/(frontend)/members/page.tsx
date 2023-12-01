import { toPlainText } from "@portabletext/react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";

import { MembersPage } from "@/components/pages/members/MembersPage";
import { urlForOpenGraphImage } from "@/sanity/lib/utils";
import { loadMembers, loadMembersPage } from "@/sanity/loader/loadQuery";
const MembersPagePreview = dynamic(() =>
	import("@/components/pages/members/MembersPagePreview")
);

export async function generateMetadata(): Promise<Metadata> {
	const { data: membersPage } = await loadMembersPage();

	// const ogImage = urlForOpenGraphImage(settings?.ogImage);
	return {
		title: membersPage?.header
			? {
					template: `%s | ${membersPage.header}`,
					default: membersPage.header || "Ruhe Template",
			  }
			: undefined,
		description: membersPage?.header,
		// openGraph: {
		//   images: ogImage ? [ogImage] : [],
		// },
	};
}

export default async function MembersRoute() {
	const { data: initial } = await loadMembersPage();
	const { data: membersData } = await loadMembers();

	if (draftMode().isEnabled) {
		return <MembersPagePreview initial={initial as any} />;
	}

	return <MembersPage members={membersData as any} pageData={initial as any} />;
}

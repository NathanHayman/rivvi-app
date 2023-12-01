import { IconMenu, Modal } from "@phunq/ui";
import { ChevronDown, Filter } from "lucide-react";
import {
	Dispatch,
	SetStateAction,
	Suspense,
	useCallback,
	useMemo,
	useState,
} from "react";

import SiteFilters from "@/ui/sites/site-filters";

function SiteFiltersModal({
	showSiteFiltersModal,
	setShowSiteFiltersModal,
}: {
	showSiteFiltersModal: boolean;
	setShowSiteFiltersModal: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<Modal
			showModal={showSiteFiltersModal}
			setShowModal={setShowSiteFiltersModal}
		>
			<Suspense>
				<SiteFilters />
			</Suspense>
		</Modal>
	);
}

function SiteFiltersButton({
	setShowSiteFiltersModal,
}: {
	setShowSiteFiltersModal: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<button
			onClick={() => setShowSiteFiltersModal(true)}
			className="mr-5 flex flex-1 items-center justify-between space-x-2 rounded-md bg-white px-3 py-2.5 shadow transition-all duration-75 hover:shadow-md active:scale-95 lg:hidden"
		>
			<IconMenu text="Filters" icon={<Filter className="h-4 w-4 shrink-0" />} />
			<ChevronDown
				className={`h-5 w-5 text-gray-400 ${
					true ? "rotate-180 transform" : ""
				} transition-all duration-75`}
			/>
		</button>
	);
}

export function useSiteFiltersModal() {
	const [showSiteFiltersModal, setShowSiteFiltersModal] = useState(false);

	const SiteFiltersModalCallback = useCallback(() => {
		return (
			<SiteFiltersModal
				showSiteFiltersModal={showSiteFiltersModal}
				setShowSiteFiltersModal={setShowSiteFiltersModal}
			/>
		);
	}, [showSiteFiltersModal, setShowSiteFiltersModal]);

	const SiteFiltersButtonCallback = useCallback(() => {
		return (
			<SiteFiltersButton setShowSiteFiltersModal={setShowSiteFiltersModal} />
		);
	}, [setShowSiteFiltersModal]);

	return useMemo(
		() => ({
			setShowSiteFiltersModal,
			SiteFiltersModal: SiteFiltersModalCallback,
			SiteFiltersButton: SiteFiltersButtonCallback,
		}),
		[setShowSiteFiltersModal, SiteFiltersModalCallback]
	);
}

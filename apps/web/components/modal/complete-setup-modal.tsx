import { ExpandingArrow, Logo, Modal } from "@phunq/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import useDomains from "@/lib/swr/use-domains";
import useSitesCount from "@/lib/swr/use-sites-count";
import useUsers from "@/lib/swr/use-users";
import { ModalContext } from "@/components/modal/provider";
import { CheckCircleFill } from "@/ui/shared/icons";

function CompleteSetupModal({
	showCompleteSetupModal,
	setShowCompleteSetupModal,
}: {
	showCompleteSetupModal: boolean;
	setShowCompleteSetupModal: Dispatch<SetStateAction<boolean>>;
}) {
	const { workspaceSlug } = useParams() as { workspaceSlug: string };

	const { verified } = useDomains();
	const { data: count } = useSitesCount();
	const { users } = useUsers();
	const { users: invites } = useUsers({ invites: true });
	const { setShowAddEditSiteModal } = useContext(ModalContext);

	const tasks = useMemo(() => {
		return [
			{
				display: "Configure your custom domain",
				cta: `/${workspaceSlug}/domains`,
				checked: verified,
			},
			{
				display: "Create a site",
				cta: `/${workspaceSlug}`,
				checked: count > 0,
			},
			{
				display: "Invite your teammates",
				cta: `/${workspaceSlug}/settings/people`,
				checked: (users && users.length > 1) || (invites && invites.length > 0),
			},
		];
	}, [workspaceSlug, verified, count]);

	return (
		<Modal
			showModal={showCompleteSetupModal}
			setShowModal={setShowCompleteSetupModal}
		>
			<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
				<Logo />
				<h3 className="text-lg font-medium">You're almost there!</h3>
				<p className="text-center text-sm text-gray-500">
					Complete the following steps and start using Rivvi to its full extent.
				</p>
			</div>
			<div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-12">
				<div className="grid divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
					{tasks.map(({ display, cta, checked }) => {
						const contents = (
							<div className="group flex items-center justify-between p-3">
								<div className="flex items-center space-x-3">
									<CheckCircleFill
										className={`h-5 w-5 ${
											checked ? "text-green-500" : "text-gray-400"
										}`}
									/>
									<p className="text-sm">{display}</p>
								</div>
								<div className="mr-5">
									<ExpandingArrow />
								</div>
							</div>
						);
						return (
							<Link
								key={display}
								href={cta}
								onClick={() => {
									setShowCompleteSetupModal(false);
									display === "Create a site" && setShowAddEditSiteModal(true);
								}}
							>
								{contents}
							</Link>
						);
					})}
				</div>
			</div>
		</Modal>
	);
}

export function useCompleteSetupModal() {
	const [showCompleteSetupModal, setShowCompleteSetupModal] = useState(false);

	const CompleteSetupModalCallback = useCallback(() => {
		return (
			<CompleteSetupModal
				showCompleteSetupModal={showCompleteSetupModal}
				setShowCompleteSetupModal={setShowCompleteSetupModal}
			/>
		);
	}, [showCompleteSetupModal, setShowCompleteSetupModal]);

	return useMemo(
		() => ({
			setShowCompleteSetupModal,
			CompleteSetupModal: CompleteSetupModalCallback,
		}),
		[setShowCompleteSetupModal, CompleteSetupModalCallback]
	);
}

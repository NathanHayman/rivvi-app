"use client";

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
} from "react";

import useWorkspace from "@/lib/swr/use-workspace";
import { useAcceptInviteModal } from "@/components/modal/accept-invite-modal";
import { useAddEditDomainModal } from "@/components/modal/add-edit-domain-modal";
import { useAddEditSiteModal } from "@/components/modal/add-edit-site-modal";
import { useAddEditWorkspaceModal } from "@/components/modal/add-edit-workspace-modal";
import { useCompleteSetupModal } from "@/components/modal/complete-setup-modal";
import { useUpgradePlanModal } from "@/components/modal/upgrade-plan-modal";

export const ModalContext = createContext<{
	setShowAddEditWorkspaceModal: Dispatch<SetStateAction<boolean>>;
	setShowCompleteSetupModal: Dispatch<SetStateAction<boolean>>;
	setShowAddEditDomainModal: Dispatch<SetStateAction<boolean>>;
	setShowAddEditSiteModal: Dispatch<SetStateAction<boolean>>;
	setShowUpgradePlanModal: Dispatch<SetStateAction<boolean>>;
}>({
	setShowAddEditWorkspaceModal: () => {},
	setShowCompleteSetupModal: () => {},
	setShowAddEditDomainModal: () => {},
	setShowAddEditSiteModal: () => {},
	setShowUpgradePlanModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {
	const {
		AddEditWorkspaceModal,
		setShowAddEditWorkspaceModal,
	} = useAddEditWorkspaceModal();
	const {
		CompleteSetupModal,
		setShowCompleteSetupModal,
	} = useCompleteSetupModal();
	const {
		setShowAddEditDomainModal,
		AddEditDomainModal,
	} = useAddEditDomainModal();
	const {
		AcceptInviteModal,
		setShowAcceptInviteModal,
	} = useAcceptInviteModal();
	const { setShowAddEditSiteModal, AddEditSiteModal } = useAddEditSiteModal();
	const { setShowUpgradePlanModal, UpgradePlanModal } = useUpgradePlanModal();

	const { error } = useWorkspace();

	// handle invite and oauth modals
	useEffect(() => {
		if (error && (error.status === 409 || error.status === 410)) {
			setShowAcceptInviteModal(true);
		}
	}, [error]);

	return (
		<ModalContext.Provider
			value={{
				setShowAddEditWorkspaceModal,
				setShowCompleteSetupModal,
				setShowAddEditDomainModal,
				setShowAddEditSiteModal,
				setShowUpgradePlanModal,
			}}
		>
			<AddEditWorkspaceModal />
			<AcceptInviteModal />
			<CompleteSetupModal />
			<AddEditDomainModal />
			<AddEditSiteModal />
			<UpgradePlanModal />
			{children}
		</ModalContext.Provider>
	);
}

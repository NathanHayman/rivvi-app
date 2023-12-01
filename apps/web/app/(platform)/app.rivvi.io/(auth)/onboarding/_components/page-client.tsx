"use client";

import va from "@vercel/analytics";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAddEditSiteModal } from "@/components/modal/add-edit-site-modal";
import { useAddEditWorkspaceModal } from "@/components/modal/add-edit-workspace-modal";
import { useUpgradePlanModal } from "@/components/modal/upgrade-plan-modal";
import Interim from "@/ui/onboarding/interim";
import Intro from "@/ui/onboarding/intro";
import Background from "@/ui/shared/background";
import { ThemeSwitch } from "@/ui/shared/theme-switch";

export default function OnbardingPageClient() {
	const {
		setShowAddEditWorkspaceModal,
		AddEditWorkspaceModal,
	} = useAddEditWorkspaceModal();
	const { setShowAddEditSiteModal, AddEditSiteModal } = useAddEditSiteModal();
	const { setShowUpgradePlanModal, UpgradePlanModal } = useUpgradePlanModal();

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		va.track("Sign Up");
	}, []);

	useEffect(() => {
		if (searchParams?.get("type") === "workspace") {
			setTimeout(() => {
				setShowAddEditWorkspaceModal(true);
			}, 200);
		} else {
			setShowAddEditWorkspaceModal(false);
		}
		if (searchParams?.get("type") === "site") {
			setTimeout(() => {
				setShowAddEditSiteModal(true);
			}, 200);
		} else {
			setShowAddEditSiteModal(false);
		}
		if (searchParams?.get("type") === "upgrade") {
			setTimeout(() => {
				setShowUpgradePlanModal(true);
			}, 200);
		} else {
			setShowUpgradePlanModal(false);
		}
	}, [
		searchParams,
		setShowAddEditSiteModal,
		setShowAddEditWorkspaceModal,
		setShowUpgradePlanModal,
	]);

	return (
		<div className="relative flex h-screen flex-col items-center">
			<Background />
			<AddEditWorkspaceModal />
			<AddEditSiteModal />
			<UpgradePlanModal />
			<AnimatePresence mode="wait">
				{!searchParams?.get("type") && <Intro key="intro" />}
				{searchParams?.get("type") === "interim" && (
					<>
						<button
							className="hover:bg-foreground group fixed left-10 top-10 z-[99999] rounded-full p-2 transition-all"
							onClick={() => router.back()}
						>
							<ArrowLeft
								size={20}
								className="text-foreground group-hover:text-background group-active:scale-90"
							/>
						</button>
						<Interim key="interim" />
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

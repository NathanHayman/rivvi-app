"use client";

import va from "@vercel/analytics";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAddEditFunnelModal } from "@/ui/modals/add-edit-funnel-modal";
import { useAddWorkspaceModal } from "@/ui/modals/add-workspace-modal";
import { useUpgradePlanModal } from "@/components/modal/upgrade-plan-modal";
import Interim from "@/ui/onboarding/interim";
import Intro from "@/ui/onboarding/intro";
import Background from "@/ui/shared/background";
import { ThemeSwitch } from "@/ui/shared/theme-switch";

export default function OnbardingPageClient() {
	const {
		setShowAddWorkspaceModal,
		AddWorkspaceModal,
	} = useAddWorkspaceModal();
	const {
		setShowAddEditFunnelModal,
		AddEditFunnelModal,
	} = useAddEditFunnelModal();
	const { setShowUpgradePlanModal, UpgradePlanModal } = useUpgradePlanModal();

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		va.track("Sign Up");
	}, []);

	useEffect(() => {
		if (searchParams?.get("type") === "workspace") {
			setTimeout(() => {
				setShowAddWorkspaceModal(true);
			}, 200);
		} else {
			setShowAddWorkspaceModal(false);
		}
		if (searchParams?.get("type") === "site") {
			setTimeout(() => {
				setShowAddEditFunnelModal(true);
			}, 200);
		} else {
			setShowAddEditFunnelModal(false);
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
		setShowAddEditFunnelModal,
		setShowAddWorkspaceModal,
		setShowUpgradePlanModal,
	]);

	return (
		<div className="relative flex h-screen flex-col items-center">
			<Background />
			<AddWorkspaceModal />
			<AddEditFunnelModal />
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

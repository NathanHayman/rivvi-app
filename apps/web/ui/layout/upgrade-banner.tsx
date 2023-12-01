"use client";

import { Badge } from "@phunq/ui";
import { Crisp } from "crisp-sdk-web";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import useWorkspace from "@/lib/swr/use-workspace";

import { ModalContext } from "../../components/modal/provider";
import ProBanner from "../workspaces/pro-banner";

export default function UpgradeBanner() {
	const { workspaceSlug } = useParams() as { workspaceSlug?: string };

	const { id, name, plan, stripeId, createdAt } = useWorkspace();
	const [showProBanner, setShowProBanner] = useState<boolean | null>(null);

	useEffect(() => {
		if (plan) {
			Crisp.session.setData({
				workspaceId: id,
				workspaceName: name,
				workspaceSlug: workspaceSlug,
				plan,
				...(stripeId && { stripeId }),
			});
			/* show pro banner if:
          - free plan
          - not hidden by user for this project 
          - project is created more than 24 hours ago
      */
			if (
				plan === "free" &&
				Cookies.get("hideProBanner") !== workspaceSlug &&
				createdAt &&
				Date.now() - new Date(createdAt).getTime() > 24 * 60 * 60 * 1000
			) {
				setShowProBanner(true);
			} else {
				setShowProBanner(false);
			}
		}
	}, [plan, id, name, workspaceSlug, stripeId, createdAt]);

	const { setShowUpgradePlanModal } = useContext(ModalContext);

	return (
		<>
			{showProBanner && <ProBanner setShowProBanner={setShowProBanner} />}
			{plan === "free" && showProBanner === false && (
				<button
					onClick={() => setShowUpgradePlanModal(true)}
					className="mb-1 ml-3 hidden sm:block"
				>
					<Badge variant="blue" className="px-3 py-1">
						Upgrade to Pro
					</Badge>
				</button>
			)}
		</>
	);
}

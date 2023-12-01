"use client";

import { buttonVariants } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useContext } from "react";

import { ModalContext } from "@/components/modal/provider";

export default function CreateSiteButton() {
	const { setShowAddSiteModal } = useContext(ModalContext);
	return (
		<button
			onClick={() => setShowAddSiteModal(true)}
			className={cn(
				buttonVariants({ variant: "default", size: "sm" }),
				"w-fit px-8"
			)}
		>
			Create Site
		</button>
	);
}

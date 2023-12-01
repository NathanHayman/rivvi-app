"use client";

import { buttonVariants } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useContext } from "react";

import { ModalContext } from "@/components/modal/provider";

export default function CreatePageButton() {
	const { setShowAddEditSiteModal } = useContext(ModalContext);
	return (
		<button
			onClick={() => setShowAddEditSiteModal(true)}
			className={cn(
				buttonVariants({ variant: "default", size: "sm" }),
				"w-fit px-8"
			)}
		>
			Create Site
		</button>
	);
}

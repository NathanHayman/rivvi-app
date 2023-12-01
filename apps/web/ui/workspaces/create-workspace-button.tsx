"use client";

import { buttonVariants } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useContext } from "react";

import { ModalContext } from "@/components/modal/provider";

export default function CreateWorkspaceButton() {
	const { setShowAddEditWorkspaceModal } = useContext(ModalContext);
	return (
		<button
			onClick={() => setShowAddEditWorkspaceModal(true)}
			className={cn(
				buttonVariants({ variant: "default", size: "sm" }),
				"w-fit px-8"
			)}
		>
			Create Workspace
		</button>
	);
}

"use client";

import { buttonVariants } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useContext } from "react";

import { ModalContext } from "@/components/modal/provider";
import { BlurImage } from "@/ui/shared/blur-image";

export default function NoWorkspacesPlaceholder() {
	const { setShowAddEditWorkspaceModal } = useContext(ModalContext);

	return (
		<div className="col-span-3 flex flex-col items-center justify-center rounded-md border py-12">
			<h2 className="text-foreground z-10 text-xl font-semibold">
				You don't have any workspaces yet!
			</h2>
			<BlurImage
				src="/_static/illustrations/shopping-call.svg"
				alt="No links yet"
				width={400}
				height={400}
				className="pointer-events-none -my-8"
			/>
			<button
				onClick={() => setShowAddEditWorkspaceModal(true)}
				className={cn(buttonVariants({ variant: "secondary" }))}
			>
				Create a workspace
			</button>
		</div>
	);
}

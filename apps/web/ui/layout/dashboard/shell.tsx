"use client";

import { cn } from "@phunq/utils";
import * as React from "react";

import useWorkspace from "@/lib/swr/use-workspace";
import { useAcceptInviteModal } from "@/components/modal/accept-invite-modal";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
	const {
		AcceptInviteModal,
		setShowAcceptInviteModal,
	} = useAcceptInviteModal();
	const { error, loading } = useWorkspace();

	// handle invite and oauth modals
	React.useEffect(() => {
		if (error && (error.status === 409 || error.status === 410)) {
			setShowAcceptInviteModal(true);
		}
	}, [error]);
	return (
		<>
			{error && (error.status === 409 || error.status === 410) && (
				<AcceptInviteModal />
			)}
			<div
				className={cn("h-[calc(100vh-60px)] overflow-auto  pb-10", className)}
				{...props}
			>
				{children}
			</div>
		</>
	);
}

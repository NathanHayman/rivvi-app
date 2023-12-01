"use client";

import { Button } from "@phunq/ui";
import { cn } from "@phunq/utils";

import useWorkspace from "@/lib/swr/use-workspace";
import { useDeleteWorkspaceModal } from "@/components/modal/delete-workspace-modal";

export default function DeleteWorkspace() {
	const {
		setShowDeleteWorkspaceModal,
		DeleteWorkspaceModal,
	} = useDeleteWorkspaceModal();

	const { plan, isOwner } = useWorkspace();
	return (
		<div
			className={cn("rounded-lg border border-red-600", {
				border: plan === "enterprise" && !isOwner,
			})}
		>
			<DeleteWorkspaceModal />
			<div className="flex flex-col space-y-3 p-5 sm:p-10">
				<h2 className="text-xl font-medium">Delete Workspace</h2>
				<p className="text-sm text-gray-500">
					Permanently delete your workspace, custom domain, and all associated
					funnels, pages + their stats. This action cannot be undone - please
					proceed with caution.
				</p>
			</div>
			<div
				className={cn("border-b border-red-600", {
					border: plan === "enterprise" && !isOwner,
				})}
			/>

			<div className="flex items-center justify-end px-5 py-4 sm:px-10">
				<div>
					<Button
						text="Delete Workspace"
						variant="destructive"
						onClick={() => setShowDeleteWorkspaceModal(true)}
						{...(plan === "enterprise" &&
							!isOwner && {
								disabledTooltip:
									"Only workspace owners can delete a workspace.",
							})}
					/>
				</div>
			</div>
		</div>
	);
}

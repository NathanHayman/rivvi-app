import { Button, Input, Label, Modal } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useParams, useRouter } from "next/navigation";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

import useWorkspace from "@/lib/swr/use-workspace";
import { BlurImage } from "@/ui/shared/blur-image";

function DeleteWorkspaceModal({
	showDeleteWorkspaceModal,
	setShowDeleteWorkspaceModal,
}: {
	showDeleteWorkspaceModal: boolean;
	setShowDeleteWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const { workspaceSlug } = useParams() as { workspaceSlug: string };
	const { id, logo, plan, isOwner } = useWorkspace();

	const [deleting, setDeleting] = useState(false);

	async function deleteWorkspace() {
		return new Promise((resolve, reject) => {
			setDeleting(true);
			fetch(`/api/workspaces/${workspaceSlug}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					router.refresh();
					router.push("/");
					resolve(null);
				} else {
					setDeleting(false);
					const error = await res.text();
					reject(error);
				}
			});
		});
	}

	return (
		<Modal
			showModal={showDeleteWorkspaceModal}
			setShowModal={setShowDeleteWorkspaceModal}
		>
			<div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-16">
				<BlurImage
					src={logo || `https://avatar.vercel.sh/${id}`}
					alt={id || "Delete Workspace"}
					className="h-10 w-10 rounded-full border"
					width={20}
					height={20}
				/>
				<h3 className="text-lg font-medium">Delete Workspace</h3>
				<p className="text-muted-foreground text-center text-sm">
					Warning: This will permanently delete your workspace, custom domain,
					and all associated sites, pages and their respective stats.
				</p>
			</div>

			<form
				onSubmit={async (e) => {
					e.preventDefault();
					toast.promise(deleteWorkspace(), {
						loading: "Deleting workspace...",
						success: "Workspace deleted successfully!",
						error: (err) => err,
					});
				}}
				className="flex flex-col space-y-6 px-4 py-8 text-left sm:px-16"
			>
				<div>
					<Label
						htmlFor="workspace-slug"
						className="text-muted-foreground block text-sm font-medium"
					>
						Enter the workpsace slug{" "}
						<span className="text-foreground font-semibold">
							{workspaceSlug}
						</span>{" "}
						to continue:
					</Label>
					<div className="relative mt-2 rounded-md shadow-sm">
						<Input
							type="text"
							name="workspace-slug"
							id="workspace-slug"
							autoFocus={false}
							autoComplete="off"
							pattern={workspaceSlug}
							disabled={plan === "enterprise" && !isOwner}
							className={cn({
								"bg-accent cursor-not-allowed":
									plan === "enterprise" && !isOwner,
							})}
						/>
					</div>
				</div>

				<div>
					<Label
						htmlFor="verification"
						className="text-muted-foreground block text-sm"
					>
						To verify, type{" "}
						<span className="text-foreground font-semibold">
							confirm delete workspace
						</span>{" "}
						below
					</Label>
					<div className="relative mt-2 rounded-md shadow-sm">
						<Input
							type="text"
							name="verification"
							id="verification"
							pattern="confirm delete workspace"
							required
							autoFocus={false}
							autoComplete="off"
							disabled={plan === "enterprise" && !isOwner}
							className={cn({
								"bg-accent cursor-not-allowed":
									plan === "enterprise" && !isOwner,
							})}
						/>
					</div>
				</div>

				<Button
					text="Confirm delete workspace"
					variant="destructive"
					loading={deleting}
					{...(plan === "enterprise" &&
						!isOwner && {
							disabledTooltip: "Only workspace owners can delete a workspace.",
						})}
				/>
			</form>
		</Modal>
	);
}

export function useDeleteWorkspaceModal() {
	const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(
		false
	);

	const DeleteWorkspaceModalCallback = useCallback(() => {
		return (
			<DeleteWorkspaceModal
				showDeleteWorkspaceModal={showDeleteWorkspaceModal}
				setShowDeleteWorkspaceModal={setShowDeleteWorkspaceModal}
			/>
		);
	}, [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal]);

	return useMemo(
		() => ({
			setShowDeleteWorkspaceModal,
			DeleteWorkspaceModal: DeleteWorkspaceModalCallback,
		}),
		[setShowDeleteWorkspaceModal, DeleteWorkspaceModalCallback]
	);
}

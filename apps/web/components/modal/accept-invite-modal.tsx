import { buttonVariants, LoadingDots, Logo, Modal } from "@phunq/ui";
import { cn } from "@phunq/utils";
import va from "@vercel/analytics";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import useWorkspace from "@/lib/swr/use-workspace";

function AcceptInviteModal({
	showAcceptInviteModal,
	setShowAcceptInviteModal,
}: {
	showAcceptInviteModal: boolean;
	setShowAcceptInviteModal: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const { workspaceSlug } = useParams() as { workspaceSlug: string };
	const [accepting, setAccepting] = useState(false);
	const { error } = useWorkspace();

	return (
		<Modal
			showModal={showAcceptInviteModal}
			setShowModal={setShowAcceptInviteModal}
			preventDefaultClose
		>
			{error?.status === 409 ? (
				<>
					<div className="border-border flex flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-16">
						<Logo />
						<h3 className="text-lg font-medium">Workspace Invitation</h3>
						<p className="text-muted-foreground text-center text-sm">
							You&apos;ve been invited to join and collaborate on the{" "}
							<span className="text-primary font-mono">
								{workspaceSlug || "......"}
							</span>{" "}
							workspace on Rivvi.
						</p>
					</div>
					<div className="bg-background flex flex-col space-y-6 px-4 py-8 text-left sm:px-16">
						<button
							onClick={() => {
								setAccepting(true);
								fetch(`/api/workspaces/${workspaceSlug}/invites/accept`, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
								}).then(async () => {
									va.track("User accepted workspace invite", {
										workspace: workspaceSlug,
									});
									await Promise.all([
										mutate(`/api/workspaces/${workspaceSlug}`),
										mutate(`/api/workspaces/${workspaceSlug}/domains`),
										router.refresh(),
									]);
									setShowAcceptInviteModal(false);
									toast.success("You now are a part of this workspace!");
								});
							}}
							disabled={accepting}
							className={cn(buttonVariants({ variant: "default" }), "w-full")}
						>
							{accepting ? <LoadingDots /> : <p>Accept invite</p>}
						</button>
					</div>
				</>
			) : (
				<>
					<div className="border-border flex flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-16">
						<Logo />
						<h3 className="text-lg font-medium">
							Workspace Invitation Expired
						</h3>
						<p className="text-muted-foreground text-center text-sm">
							This invite has expired or is no longer valid.
						</p>
					</div>
					<div className="bg-secondary flex flex-col space-y-6 px-4 py-8 text-left sm:px-16">
						<Link
							href="/"
							className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
						>
							Back to dashboard
						</Link>
					</div>
				</>
			)}
		</Modal>
	);
}

export function useAcceptInviteModal() {
	const [showAcceptInviteModal, setShowAcceptInviteModal] = useState(false);

	const AcceptInviteModalCallback = useCallback(() => {
		return (
			<AcceptInviteModal
				showAcceptInviteModal={showAcceptInviteModal}
				setShowAcceptInviteModal={setShowAcceptInviteModal}
			/>
		);
	}, [showAcceptInviteModal, setShowAcceptInviteModal]);

	return useMemo(
		() => ({
			setShowAcceptInviteModal,
			AcceptInviteModal: AcceptInviteModalCallback,
		}),
		[setShowAcceptInviteModal, AcceptInviteModalCallback]
	);
}

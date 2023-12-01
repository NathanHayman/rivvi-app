import { Avatar, Button, Input, Label, Modal } from "@phunq/ui";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

function DeleteAccountModal({
	showDeleteAccountModal,
	setShowDeleteAccountModal,
}: {
	showDeleteAccountModal: boolean;
	setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const { data: session, update } = useSession();
	const [deleting, setDeleting] = useState(false);

	async function deleteAccount() {
		setDeleting(true);
		await fetch(`/api/user`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				update();
				// delay to allow for the route change to complete
				await new Promise((resolve) =>
					setTimeout(() => {
						router.push("/register");
						resolve(null);
					}, 200)
				);
			} else {
				setDeleting(false);
				const error = await res.text();
				throw error;
			}
		});
	}

	return (
		<Modal
			showModal={showDeleteAccountModal}
			setShowModal={setShowDeleteAccountModal}
		>
			<div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-16">
				<Avatar user={session?.user} />
				<h3 className="text-lg font-medium">Delete Account</h3>
				<p className="text-muted-foreground text-center text-sm">
					Warning: This will permanently delete your account and all your Rivvi
					funnels, pages and their respective stats.
				</p>
			</div>

			<form
				onSubmit={async (e) => {
					e.preventDefault();
					toast.promise(deleteAccount(), {
						loading: "Deleting account...",
						success: "Account deleted successfully!",
						error: (err) => err,
					});
				}}
				className="flex flex-col space-y-6 px-4 py-8 text-left sm:px-16"
			>
				<div>
					<Label
						htmlFor="verification"
						className="text-muted-foreground block text-sm"
					>
						To verify, type{" "}
						<span className="text-foreground font-semibold">
							confirm delete account
						</span>{" "}
						below
					</Label>
					<div className="relative mt-2 rounded-md shadow-sm">
						<Input
							type="text"
							name="verification"
							id="verification"
							pattern="confirm delete account"
							required
							autoFocus={false}
							autoComplete="off"
						/>
					</div>
				</div>

				<Button
					text="Confirm delete account"
					variant="destructive"
					loading={deleting}
				/>
			</form>
		</Modal>
	);
}

export function useDeleteAccountModal() {
	const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

	const DeleteAccountModalCallback = useCallback(() => {
		return (
			<DeleteAccountModal
				showDeleteAccountModal={showDeleteAccountModal}
				setShowDeleteAccountModal={setShowDeleteAccountModal}
			/>
		);
	}, [showDeleteAccountModal, setShowDeleteAccountModal]);

	return useMemo(
		() => ({
			setShowDeleteAccountModal,
			DeleteAccountModal: DeleteAccountModalCallback,
		}),
		[setShowDeleteAccountModal, DeleteAccountModalCallback]
	);
}

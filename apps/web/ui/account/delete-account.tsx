"use client";
import { Button } from "@phunq/ui";

import { useDeleteAccountModal } from "@/components/modal/delete-account-modal";

export default function DeleteAccountSection() {
	const {
		setShowDeleteAccountModal,
		DeleteAccountModal,
	} = useDeleteAccountModal();

	return (
		<div className="border-border rounded-lg border">
			<DeleteAccountModal />
			<div className="flex flex-col space-y-3 p-5 sm:p-10">
				<h2 className="text-foreground text-xl font-medium">Delete Account</h2>
				<p className="text-muted-foreground text-xs">
					Permanently delete your PHUNQ account and all of your funnels + their
					pages. This action cannot be undone - please proceed with caution.
				</p>
			</div>
			<div className="border-border bg-accent/50 flex w-full items-center justify-end border-t px-4 py-3 lg:px-6 lg:py-5">
				<div>
					<Button
						text="Delete Account"
						variant="destructive"
						onClick={() => setShowDeleteAccountModal(true)}
					/>
				</div>
			</div>
		</div>
	);
}

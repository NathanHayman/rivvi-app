import { Button, Modal } from "@phunq/ui";
import { linkConstructor } from "@phunq/utils";
import { useParams, useSearchParams } from "next/navigation";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import { SiteProps } from "@/lib/types";

function DeleteSiteModal({
	showDeleteSiteModal,
	setShowDeleteSiteModal,
	props,
}: {
	showDeleteSiteModal: boolean;
	setShowDeleteSiteModal: Dispatch<SetStateAction<boolean>>;
	props: SiteProps;
}) {
	const params = useParams() as { workspaceSlug?: string };
	const { workspaceSlug } = params;
	const [deleting, setDeleting] = useState(false);

	const { key, domain } = props as { key: string; domain: string };

	const site = useMemo(() => {
		return linkConstructor({
			key,
			domain,
			pretty: true,
		});
	}, [key, domain]);

	return (
		<Modal
			showModal={showDeleteSiteModal}
			setShowModal={setShowDeleteSiteModal}
		>
			<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 text-center sm:px-16">
				<h3 className="text-lg font-medium">Delete {site}</h3>
				<p className="text-sm text-gray-500">
					Warning: Deleting this site will remove all of its stats. This action
					cannot be undone.
				</p>
			</div>

			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setDeleting(true);
					fetch(
						`/api${
							workspaceSlug ? `/workspaces/${workspaceSlug}/sites` : "/sites"
						}/${props.id}`,
						{
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
							},
						}
					).then(async (res) => {
						if (res.status === 200) {
							await Promise.all([
								mutate(
									(key) =>
										typeof key === "string" &&
										key.startsWith(
											`/api${
												workspaceSlug ? `/workspaces/${workspaceSlug}` : ""
											}/sites`
										)
								),
								mutate(
									(key) =>
										typeof key === "string" &&
										key.startsWith(
											`/api${
												workspaceSlug ? `/workspaces/${workspaceSlug}` : ""
											}/sites/count`
										),
									undefined,
									{ revalidate: true }
								),
							]);
							setShowDeleteSiteModal(false);
							toast.success("Successfully deleted site!");
						} else {
							const { error } = await res.json();
							toast.error(error);
						}
						setDeleting(false);
					});
				}}
				className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
			>
				<div>
					<label htmlFor="verification" className="block text-sm text-gray-700">
						To verify, type <span className="font-semibold">{site}</span> below
					</label>
					<div className="relative mt-1 rounded-md shadow-sm">
						<input
							type="text"
							name="verification"
							id="verification"
							pattern={site}
							required
							autoFocus
							autoComplete="off"
							className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
						/>
					</div>
				</div>

				<Button
					variant="destructive"
					text="Confirm delete"
					loading={deleting}
				/>
			</form>
		</Modal>
	);
}

export function useDeleteSiteModal({ props }: { props?: SiteProps }) {
	const [showDeleteSiteModal, setShowDeleteSiteModal] = useState(false);

	const DeleteSiteModalCallback = useCallback(() => {
		return props ? (
			<DeleteSiteModal
				showDeleteSiteModal={showDeleteSiteModal}
				setShowDeleteSiteModal={setShowDeleteSiteModal}
				props={props}
			/>
		) : null;
	}, [showDeleteSiteModal, setShowDeleteSiteModal]);

	return useMemo(
		() => ({
			setShowDeleteSiteModal,
			DeleteSiteModal: DeleteSiteModalCallback,
		}),
		[setShowDeleteSiteModal, DeleteSiteModalCallback]
	);
}

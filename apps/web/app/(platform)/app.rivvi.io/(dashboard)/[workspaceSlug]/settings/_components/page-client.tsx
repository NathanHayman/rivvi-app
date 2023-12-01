"use client";

import { Form } from "@phunq/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";

import useWorkspace from "@/lib/swr/use-workspace";
import DeleteWorkspace from "@/ui/workspaces/delete-workspace";
import UploadLogo from "@/ui/workspaces/upload-logo";

export default function WorkspaceSettingsClient() {
	const router = useRouter();
	const { name, slug, plan, isOwner } = useWorkspace();

	return (
		<>
			<Form
				title="Workspace Name"
				description="This is the name of your workspace on Phunq."
				inputData={{
					name: "name",
					defaultValue: name,
					placeholder: "My Workspace",
					maxLength: 32,
				}}
				helpText="Max 32 characters."
				{...(plan === "enterprise" &&
					!isOwner && {
						disabledTooltip:
							"Only workspace owners can change the workspace name.",
					})}
				handleSubmit={(updateData) =>
					fetch(`/api/workspaces/${slug}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(updateData),
					}).then(async (res) => {
						if (res.status === 200) {
							router.refresh();
							await mutate(`/api/workspaces/${slug}`);
							toast.success("Successfully updated workspace name!");
						} else if (res.status === 422) {
							toast.error("Workspace slug already exists");
						} else {
							const errorMessage = await res.text();
							toast.error(errorMessage || "Something went wrong");
						}
					})
				}
			/>
			<Form
				title="Workspace Slug"
				description="This is your workspace's unique slug on Phunq."
				inputData={{
					name: "slug",
					defaultValue: slug,
					placeholder: "my-workspace",
					pattern: "^[a-z0-9-]+$",
					maxLength: 48,
				}}
				helpText="Only lowercase letters, numbers, and dashes. Max 48 characters."
				{...(plan === "enterprise" &&
					!isOwner && {
						disabledTooltip:
							"Only workspace owners can change the workspace slug.",
					})}
				handleSubmit={(data) =>
					fetch(`/api/workspaces/${slug}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}).then(async (res) => {
						if (res.status === 200) {
							const { slug: newSlug } = await res.json();
							router.refresh();
							router.push(`/${newSlug}/settings`);
							toast.success("Successfully updated workspace slug!");
						} else if (res.status === 422) {
							toast.error("Workspace slug already exists");
						} else {
							toast.error("Something went wrong");
						}
					})
				}
			/>
			<UploadLogo />
			<DeleteWorkspace />
		</>
	);
}

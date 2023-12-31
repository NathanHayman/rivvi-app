"use client";

import { Form } from "@phunq/ui";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import DeleteAccountSection from "@/ui/account/delete-account";
import UploadAvatar from "@/ui/account/upload-avatar";

export default function SettingsPageClient() {
	const { data: session, update, status } = useSession();

	return (
		<>
			<Form
				title="Your Name"
				description="This will be your display name on phunq."
				inputData={{
					name: "name",
					defaultValue:
						status === "loading" ? undefined : session?.user?.name || "",
					placeholder: "Steve Jobs",
					maxLength: 32,
				}}
				helpText="Max 32 characters."
				handleSubmit={(data) =>
					fetch("/api/user", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}).then(async (res) => {
						if (res.status === 200) {
							update();
							toast.success("Successfully updated your name!");
						} else {
							const errorMessage = await res.text();
							toast.error(errorMessage || "Something went wrong");
						}
					})
				}
			/>
			<Form
				title="Your Email"
				description="This will be the email you use to log in to phunq and receive notifications."
				inputData={{
					name: "email",
					defaultValue: session?.user?.email || undefined,
					placeholder: "panic@thedis.co",
				}}
				helpText="Must be a valid email address."
				handleSubmit={(data) =>
					fetch("/api/user", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}).then(async (res) => {
						if (res.status === 200) {
							update();
							toast.success("Successfully updated your email!");
						} else {
							const errorMessage = await res.text();
							toast.error(errorMessage || "Something went wrong");
						}
					})
				}
			/>
			<UploadAvatar />
			<DeleteAccountSection />
		</>
	);
}

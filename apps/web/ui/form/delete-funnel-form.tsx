"use client";

import { buttonVariants, Input, LoadingDots } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { revalidateTag } from "next/cache";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { deleteSiteFromWorkspace } from "@/lib/actions/site";

export default function DeleteSiteForm({
	workspaceSlug,
	siteName,
}: {
	workspaceSlug: string;
	siteName: string;
}) {
	const { key } = useParams() as { key: string };
	const { push } = useRouter();
	return (
		<form
			action={async () => {
				await deleteSiteFromWorkspace({ workspaceSlug, key });
				push(`/${workspaceSlug}/sites`);
				revalidateTag(`${workspaceSlug}-sites`);
				toast.success("Site deleted successfully.");
			}}
			className="bg-background border-border w-full rounded-lg border"
		>
			<div className="flex flex-col items-start justify-center p-4 lg:p-6">
				<h2 className="text-foreground mb-2 text-base font-medium">
					Delete Site
				</h2>
				<p className="text-muted-foreground text-sm">
					Please type the name{" "}
					<span className="text-primary font-bold">{siteName}</span> of the site
					to confirm. This action cannot be undone.
				</p>
			</div>
			<div className="relative flex flex-col space-y-4 p-5 sm:p-10 sm:px-6">
				<Input
					name="confirm"
					type="text"
					required
					pattern={siteName}
					placeholder={siteName}
				/>
			</div>

			<div className="border-border bg-accent/50 flex w-full items-end justify-between border-t px-4 py-3 lg:px-6 lg:py-5">
				<p className="text-muted-foreground text-xs sm:max-w-md">
					Permanently delete your workspace, custom domain, and all associated
					sites + their pages. This action cannot be undone - please proceed
					with caution. {key}
				</p>
				<div>
					<FormButton />
				</div>
			</div>
		</form>
	);
}

function FormButton() {
	const { pending } = useFormStatus();
	return (
		<button
			className={cn(
				buttonVariants({ variant: "default", size: "sm" }),
				"border-border flex h-8 w-40 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
				pending
					? "cursor-not-allowed "
					: "border-border bg-destructive hover:bg-destructive/90"
			)}
			disabled={pending}
		>
			{pending ? <LoadingDots /> : <p>Delete Funnel</p>}
		</button>
	);
}

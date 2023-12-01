"use client";

import { buttonVariants, LoadingDots } from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { syncPagesFromSanity } from "@/lib/actions/page";
import useWorkspace from "@/lib/swr/use-workspace";

export default function SyncFromStudio() {
	const router = useRouter();
	const { workspaceSlug } = useParams() as { workspaceSlug: string };
	const { studioKey, studioTokenEditor } = useWorkspace();
	const [isPending, startTransition] = useTransition();

	return (
		<button
			onClick={() =>
				startTransition(async () => {
					const { error, success } = await syncPagesFromSanity(
						workspaceSlug as string,
						studioKey as string,
						studioTokenEditor as string
					);
					if (error) {
						toast.error(
							"Something went wrong while syncing pages from Sanity. Please try again later."
						);
						return;
					}
					success && toast.success("Pages synced from Sanity.");
					router.refresh();
				})
			}
			className={cn(
				buttonVariants({ variant: "default", size: "sm" }),
				"w-fit px-8"
			)}
			disabled={isPending}
		>
			{isPending ? <LoadingDots /> : <p>Sync from Studio</p>}
		</button>
	);
}

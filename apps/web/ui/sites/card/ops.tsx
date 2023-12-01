"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	buttonVariants,
	DashIcons as Icons,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Input,
	LoadingDots,
} from "@phunq/ui";
import { cn } from "@phunq/utils";
import { Site } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { deleteSiteFromWorkspace } from "@/lib/actions/site";

export function SiteOps({ site }: { site: Site }) {
	const { workspaceSlug } = useParams() as { workspaceSlug: string };
	const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
	const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="hover:bg-accent border-accent flex h-8 w-8 items-center justify-center rounded-md  transition-colors">
					<Icons.ellipsis className="h-4 w-4" />
					<span className="sr-only">Open</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="border-border bg-background border opacity-100"
				>
					<DropdownMenuItem className="hover:bg-accent">
						<Link
							href={`/${workspaceSlug}/sites/${site.key}/settings`}
							className="flex w-full"
						>
							Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive focus:text-destructive hover:bg-accent flex cursor-pointer items-center"
						onSelect={() => setShowDeleteAlert(true)}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent className="border-accent bg-modal w-full rounded-lg border">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-foreground text-lg font-semibold">
							Are you sure you want to delete this site?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground pt-2 text-sm font-normal">
							Deletes your site and all pages associated with it. Type in the
							name of your site{" "}
							<b className="text-primary font-bold">{site.name}</b> to confirm.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<Input
						name="confirm"
						type="text"
						required
						pattern={site.name as string}
						placeholder={site.name as string}
					/>
					<AlertDialogFooter className="mt-4 flex w-full items-center justify-between">
						<AlertDialogCancel className="w-full border-none">
							Nevermind
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={async (event) => {
								event.preventDefault();
								setIsDeleteLoading(true);
								await deleteSiteFromWorkspace({
									workspaceSlug,
									key: site.key,
								} as any);
								toast.success("Funnel deleted successfully.");
								setIsDeleteLoading(false);
								setShowDeleteAlert(false);
							}}
							className={cn(
								buttonVariants({ variant: "destructive" }),
								"w-full sm:max-w-[22rem]"
							)}
							disabled={isDeleteLoading}
						>
							{isDeleteLoading ? (
								<LoadingDots className="bg-foreground" />
							) : (
								<p>Confirm Delete</p>
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

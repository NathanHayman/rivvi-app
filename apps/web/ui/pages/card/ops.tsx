"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	DashIcons as Icons,
	dButton as Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@phunq/ui";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { removePageFromSite } from "@/lib/actions/site";

export default function PageOps({ page, id }: { page: any; id: string }) {
	const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
	const { key, workspaceSlug } = useParams() as {
		key: string;
		workspaceSlug: string;
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="hover-bg-slate-5 border-slate-6 bg-root flex h-8 w-8 items-center justify-center rounded-md transition-colors">
					<Icons.ellipsis className="h-4 w-4" />
					<span className="sr-only">Open</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="border-slate-6 bg-root border"
				>
					<DropdownMenuItem
						className="text-destructive hover-bg-slate-5 flex cursor-pointer items-center font-bold hover:text-white hover:underline focus:text-white"
						onSelect={() => setShowDeleteAlert(true)}
					>
						Remove From Funnel
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent className="border-slate-6 bg-root relative w-full rounded-lg border">
					<AlertDialogCancel className="absolute right-0 top-0 border-none">
						<button
							className="border-slate-6 z-[999]"
							onClick={() => setShowDeleteAlert(false)}
						>
							<Icons.close className="h-6 w-6" />
						</button>
					</AlertDialogCancel>
					<div className="relative flex flex-col space-y-4 p-5 md:p-8">
						<h2 className="text-xl">Remove Page</h2>
						<p className="text-slate-11">
							Are you sure you want to remove this page from the funnel?
						</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								removePageFromSite({ workspaceSlug, key, id });
								setShowDeleteAlert(false);
								toast.success("Successfully removed page from funnel!");
							}}
							className="border-slate-6 flex items-center justify-end rounded-b-lg p-3"
						>
							<Button
								variant={"ghost"}
								className="text-slate-12 hover:text-destructive-600"
								onClick={() => setShowDeleteAlert(false)}
							>
								Cancel
							</Button>
							<Button variant={"destructive"} className=" ml-4" type="submit">
								Remove Page from Funnel
							</Button>
						</form>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

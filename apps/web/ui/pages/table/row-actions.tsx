"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	buttonVariants,
	DashIcons as Icons,
	dButton as Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Input,
	LoadingDots,
} from "@phunq/ui";
import { cn } from "@phunq/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { labels } from "./data/data";
import { pageSchema } from "./data/schema";

interface TableRowActionsProps<TData> {
	row: Row<TData>;
}

export function TableRowActions<TData>({ row }: TableRowActionsProps<TData>) {
	const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
	const { key, workspaceSlug } = useParams() as {
		key: string;
		workspaceSlug: string;
	};
	const page = row.original as typeof pageSchema & {
		id: string;
		label: string;
		published: boolean;
		type: string;
		title: string;
		slug: string;
		funnelDomainSlug: string;
	};

	const isCustomPage = page.type === "custom";
	const router = useRouter();

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild className="hover:bg-secondary">
					<Button
						variant="ghost"
						size="sm"
						className="data-[state=open]:bg-secondary -ml-3 h-8"
					>
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="bg-background border-border text-muted-foreground w-[160px]"
				>
					<DropdownMenuItem
						className={cn(
							"hover:bg-secondary",
							page.published ? "cursor-pointer" : "cursor-not-allowed"
						)}
						onSelect={() => {
							// open modal to publish page ( use url params to set ?modal=publish_page )
							if (!page.published) {
								router.push(`/${workspaceSlug}/pages/${page.id}`);
							} else {
								toast.error(
									"You cannot edit this page. Please contact support."
								);
							}
						}}
					>
						Publish
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:bg-secondary">
						Publish
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:bg-secondary">
						Favorite
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-border" />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="hover:bg-secondary">
							Labels
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="bg-background border-border text-muted-foreground">
							<DropdownMenuRadioGroup value={page.label}>
								{labels.map((label) => (
									<DropdownMenuRadioItem
										key={label.value}
										value={label.value}
										className="hover:bg-secondary"
									>
										{label.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator className="bg-border" />
					<DropdownMenuItem
						className={cn(
							"hover:bg-secondary",
							isCustomPage ? "cursor-pointer" : "cursor-not-allowed"
						)}
						onSelect={() => {
							// if the page is a custom page, we can allow them to edit it by routing to /${workspaceSlug}/pages/${page.id}
							// if not do not allow them to edit it
							if (isCustomPage) {
								setShowDeleteAlert(true);
							} else {
								toast.error(
									"You cannot edit this page. Please contact support."
								);
							}
						}}
					>
						Delete
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

function FormButton() {
	const { pending } = useFormStatus();
	return (
		<button
			className={cn(buttonVariants({ variant: "destructive" }), "w-full")}
			disabled={pending}
		>
			{pending ? (
				<LoadingDots className="bg-foreground" />
			) : (
				<p>Confirm Delete</p>
			)}
		</button>
	);
}

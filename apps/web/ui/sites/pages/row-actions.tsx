"use client";

import {
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
} from "@phunq/ui";
import { cn } from "@phunq/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
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
							page.published ? "cursor-not-allowed" : "cursor-pointer"
						)}
						onSelect={() => {
							// open modal to publish page
							if (page.published) {
								toast.error("This page is already published.");
							} else {
								router.push(
									`/${workspaceSlug}/pages/?modal=publish_page&id=${encodeURIComponent(
										page.id
									)}`
								);
							}
						}}
					>
						Publish
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:bg-secondary">
						Make a Copy
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

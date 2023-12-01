"use client";

import { Avatar, Popover, Tick } from "@phunq/ui";
import { cn, GOOGLE_FAVICON_URL } from "@phunq/utils";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useMemo, useState } from "react";

import { PlanProps, WorkspaceWithDomainProps } from "@/lib/types";
import { ModalContext } from "@/components/modal/provider";
import PlanBadge from "@/ui/workspaces/plan-badge";

import WorkspaceSelectPlaceholder from "./placeholder";

export default function WorkspaceSelectClient({
	workspaces,
}: {
	workspaces: WorkspaceWithDomainProps[];
}) {
	const { data: session, status } = useSession();
	const { workspaceSlug, key } = useParams() as {
		workspaceSlug?: string;
		key?: string;
	};

	const selected = useMemo(() => {
		const selectedWorkspace = workspaces?.find(
			(workspace) => workspace.slug === workspaceSlug
		);

		if (workspaceSlug && workspaces && selectedWorkspace) {
			return {
				...selectedWorkspace,
				image:
					selectedWorkspace?.logo ||
					`${GOOGLE_FAVICON_URL}${selectedWorkspace?.primaryDomain?.slug}`,
			};

			// return personal account selector if there's no project or error (user doesn't have access to project)
		} else {
			return {
				name: session?.user?.name || session?.user?.email,
				slug: "/",
				image:
					session?.user?.image ||
					`https://api.dicebear.com/7.x/micah/svg?seed=${session?.user?.email}`,
				plan: "free",
			};
		}
	}, [workspaceSlug, workspaces, session]) as {
		id?: string;
		name: string;
		slug: string;
		image: string;
		plan: PlanProps;
	};

	const [openPopover, setOpenPopover] = useState(false);
	const [hide, setHide] = useState(false);

	if (status === "loading") {
		return <WorkspaceSelectPlaceholder />;
	}

	return (
		<div
			className={cn(
				"-mb-8 flex items-center justify-between rounded-md py-2",
				hide ? "w-12 px-0" : "w-full px-3"
			)}
		>
			<Popover
				content={
					<WorkspaceList
						selected={selected}
						workspaces={workspaces}
						setOpenPopover={setOpenPopover}
					/>
				}
				openPopover={openPopover}
				setOpenPopover={setOpenPopover}
				className=""
			>
				<button
					onClick={() => setOpenPopover(!openPopover)}
					className={cn(
						"hover:bg-muted/50 hover:text-foreground text-muted-foreground  border-border flex w-full items-center justify-between rounded-lg border py-0.5 text-left text-sm transition-all duration-75 focus:outline-none",
						openPopover ? "bg-secondary" : "",
						hide ? "w-12" : "w-full px-1.5"
					)}
				>
					<div
						className={cn(
							"flex w-full items-center space-x-3",
							hide ? "pl-0" : "pr-2"
						)}
					>
						<img
							src={selected.image || "/favicon.svg"}
							alt={selected.id || selected.name}
							className="h-8 w-8 flex-none overflow-hidden rounded-full"
						/>
						<div
							className={cn(
								key ? "hidden" : "flex",
								hide ? "w-0" : "w-full",
								"items-center space-x-3 sm:flex"
							)}
						>
							<span className="text-muted-foreground inline-block max-w-[100px] truncate text-sm font-medium sm:max-w-[200px]">
								{selected.name}
							</span>
							{selected.slug !== "/" && !hide && (
								<PlanBadge plan={selected.plan} />
							)}
						</div>
					</div>
					<ChevronsUpDown
						className="text-muted-foreground h-4 w-4"
						aria-hidden="true"
					/>
				</button>
			</Popover>
		</div>
	);
}

function WorkspaceList({
	selected,
	workspaces,
	setOpenPopover,
}: {
	selected: {
		name: string;
		slug: string;
		image: string;
		plan: PlanProps;
	};
	workspaces: WorkspaceWithDomainProps[];
	setOpenPopover: (open: boolean) => void;
}) {
	const { data: session } = useSession();
	const { setShowAddEditWorkspaceModal } = useContext(ModalContext);
	const { domain, key } = useParams() as { domain?: string; key?: string };
	const pathname = usePathname();

	const href = useCallback(
		(slug: string) => {
			if (domain || key || selected.slug === "/") {
				// if we're on a link page, navigate back to the project root
				return `/${slug}`;
			} else {
				// else, we keep the path but remove all query params
				return pathname?.replace(selected.slug, slug).split("?")[0] || "/";
			}
		},
		[domain, key, pathname, selected.slug]
	);

	return (
		<div className="bg-popover relative mt-1 max-h-72 w-full space-y-0.5 overflow-auto rounded-md border p-2 text-base  sm:w-60 sm:text-sm sm:shadow-lg">
			<div className="text-muted-foreground p-2 text-xs">Personal Account</div>
			<Link
				key="personal"
				className={`relative flex w-full items-center space-x-2 rounded-md px-2 py-1.5${
					selected.slug === "/"
						? "bg-muted/50 border-border text-foreground"
						: ""
				} transition-all duration-75`}
				href="/"
				onClick={() => setOpenPopover(false)}
			>
				<Avatar user={session?.user} className="h-7 w-7" />
				<span
					className={`text-slate-11 block truncate pr-8 text-sm ${
						selected.slug === "/" ? "font-medium" : "font-normal"
					}`}
				>
					{session?.user?.name || session?.user?.email}
				</span>
				{selected.slug === "/" ? (
					<span className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-3">
						<Tick className="h-5 w-5" aria-hidden="true" />
					</span>
				) : null}
			</Link>
			<div className="text-muted-foreground p-2 pt-4 text-xs">
				Custom Workspaces
			</div>
			{workspaces.map(({ id, name, slug, logo, primaryDomain }) => (
				<Link
					key={slug}
					className={`hover:bg-muted/50 hover:text-foreground text-muted-foreground relative flex w-full items-center space-x-2 rounded-md px-2 py-1.5 ${
						selected.slug === slug
							? "bg-muted/50 border-border text-foreground"
							: ""
					} transition-all duration-75`}
					href={href(slug) as string}
					shallow={false}
					onClick={() => setOpenPopover(false)}
				>
					<img
						src={logo || `${GOOGLE_FAVICON_URL}${primaryDomain?.slug}`}
						alt={id}
						className="h-7 w-7 overflow-hidden rounded-full"
					/>
					<span
						className={`text-foreground block truncate text-sm ${
							selected.slug === slug ? "font-medium" : "font-normal"
						}`}
					>
						{name}
					</span>
					{selected.slug === slug ? (
						<span className="text-primary absolute inset-y-0 right-0 flex items-center pr-3">
							<Tick className="h-5 w-5" aria-hidden="true" />
						</span>
					) : null}
				</Link>
			))}
			<button
				key="add"
				onClick={() => {
					setOpenPopover(false);
					setShowAddEditWorkspaceModal(true);
				}}
				className="hover:bg-muted/50 hover:text-foreground text-foreground flex w-full cursor-pointer items-center space-x-2 rounded-md p-2 transition-all duration-75"
			>
				<PlusCircle className="text-slate-11 h-6 w-6" />
				<span className="text-slate-11 block truncate">
					Add a new workspace
				</span>
			</button>
		</div>
	);
}

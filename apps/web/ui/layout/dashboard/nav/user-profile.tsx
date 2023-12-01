"use client";

import { Avatar, IconMenu, Popover } from "@phunq/ui";
import { User } from "@prisma/client";
import { Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { Logout } from "@/ui/shared/icons";
import { ThemeSwitch } from "@/ui/shared/theme-switch";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function UserProfile() {
	const session = await getSession();
	if (!session?.user) {
		redirect("/login");
	}
	const [openPopover, setOpenPopover] = useState(false);
	return (
		<Popover
			content={
				<div className="border-border bg-popover text-popover-foreground mr-8 flex w-full flex-col space-y-px rounded-md border p-3 shadow-md sm:w-56">
					<div className="p-2">
						{session?.user?.name && (
							<p className="text-foreground truncate text-sm font-medium">
								{session?.user?.name}
							</p>
						)}
						<p className="text-muted-foreground truncate text-sm">
							{session?.user?.email}
						</p>
					</div>
					<Link
						href="/settings"
						className="hover:bg-muted/50 hover:text-foreground text-muted-foreground block w-full rounded-md p-2 text-sm transition-all duration-75"
					>
						<IconMenu text="Settings" icon={<Settings className="h-4 w-4" />} />
					</Link>
					<ThemeSwitch />
					<button
						className="hover:text-foreground text-muted-foreground block w-full rounded-md p-2 text-sm transition-all duration-75"
						onClick={() => {
							signOut({
								callbackUrl: "/login",
							});
						}}
					>
						<IconMenu text="Logout" icon={<Logout className="h-4 w-4" />} />
					</button>
				</div>
			}
			align="start"
			openPopover={openPopover}
			setOpenPopover={setOpenPopover}
		>
			<button
				onClick={() => setOpenPopover(!openPopover)}
				className="group relative"
			>
				{session?.user ? (
					<Avatar
						user={session?.user as User}
						className="border-border h-8 w-8 border sm:h-9 sm:w-9"
					/>
				) : (
					<div className="border-accent bg-muted h-8 w-8 animate-pulse rounded-full border-2 sm:h-9 sm:w-9" />
				)}
			</button>
		</Popover>
	);
}

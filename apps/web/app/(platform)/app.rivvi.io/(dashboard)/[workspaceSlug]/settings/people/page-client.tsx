"use client";

import { Avatar, Badge, buttonVariants, IconMenu, Popover } from "@phunq/ui";
import { cn, timeAgo } from "@phunq/utils";
import { UserMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import useUsers from "@/lib/swr/use-users";
import useWorkspace from "@/lib/swr/use-workspace";
import { UserProps } from "@/lib/types";
import { useEditRoleModal } from "@/components/modal/edit-role-modal";
import { useInviteTeammateModal } from "@/components/modal/invite-teammate-modal";
import { useRemoveTeammateModal } from "@/components/modal/remove-teammate-modal";
import { BlurImage } from "@/ui/shared/blur-image";
import { ThreeDots } from "@/ui/shared/icons";

const tabs: Array<"Members" | "Invitations"> = ["Members", "Invitations"];

export default function WorkspacePeopleClient() {
	const {
		setShowInviteTeammateModal,
		InviteTeammateModal,
	} = useInviteTeammateModal();

	const [currentTab, setCurrentTab] = useState<"Members" | "Invitations">(
		"Members"
	);

	const { users } = useUsers({ invites: currentTab === "Invitations" });

	return (
		<>
			<InviteTeammateModal />
			<div className="border-border rounded-lg border ">
				<div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
					<div className="flex flex-col space-y-3">
						<h2 className="text-xl font-medium">People</h2>
						<p className="text-muted-foreground text-sm">
							Teammates that have access to this workspace.
						</p>
					</div>
					<button
						onClick={() => setShowInviteTeammateModal(true)}
						className={cn(buttonVariants({ variant: "default", size: "sm" }))}
					>
						Invite
					</button>
				</div>
				<div className="border-border flex space-x-3 border-b px-3 sm:px-7">
					{tabs.map((tab, index) => (
						<div
							key={tab}
							className={`${
								tab === currentTab ? "" : "border-transparent"
							} mb-4 py-1`}
						>
							<button
								onClick={() => setCurrentTab(tab)}
								className={cn(
									"active:bg-accent rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:opacity-80 focus:outline-none",
									{
										"text-foreground bg-secondary": tab === currentTab,
										"text-muted-foreground bg-transparent": tab !== currentTab,
									}
								)}
							>
								{tab}
							</button>
						</div>
					))}
				</div>
				<div className="divide-secondary grid divide-y">
					{users ? (
						users.length > 0 ? (
							users.map((user) => (
								<UserCard
									key={user.email}
									user={user}
									currentTab={currentTab}
								/>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-10">
								<BlurImage
									src="/_static/illustrations/video-park.svg"
									alt="No invitations sent"
									width={300}
									height={300}
									className="pointer-events-none -my-8"
								/>
								<p className="text-muted-foreground text-sm">
									No invitations sent
								</p>
							</div>
						)
					) : (
						Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)
					)}
				</div>
			</div>
		</>
	);
}

const UserCard = ({
	user,
	currentTab,
}: {
	user: UserProps;
	currentTab: "Members" | "Invitations";
}) => {
	const [openPopover, setOpenPopover] = useState(false);

	const { plan, isOwner } = useWorkspace();

	const { name, email, createdAt, role: currentRole } = user;

	const [role, setRole] = useState<"OWNER" | "MEMBER">(currentRole);

	const { EditRoleModal, setShowEditRoleModal } = useEditRoleModal({
		user,
		role,
	});

	const {
		RemoveTeammateModal,
		setShowRemoveTeammateModal,
	} = useRemoveTeammateModal({ user, invite: currentTab === "Invitations" });

	const { data: session } = useSession();

	// invites expire after 14 days of being sent
	const expiredInvite =
		currentTab === "Invitations" &&
		createdAt &&
		Date.now() - new Date(createdAt).getTime() > 14 * 24 * 60 * 60 * 1000;

	return (
		<>
			<EditRoleModal />
			<RemoveTeammateModal />
			<div
				key={email}
				className="flex items-center justify-between space-x-3 px-4 py-3 sm:pl-8"
			>
				<div className="flex items-start space-x-3">
					<div className="flex items-center space-x-3">
						<Avatar user={user} />
						<div className="flex flex-col">
							<h3 className="text-sm font-medium">{name || email}</h3>
							<p className="text-muted-foreground text-xs">{email}</p>
						</div>
					</div>

					{expiredInvite && <Badge variant="gray">Expired</Badge>}
				</div>
				<div className="flex items-center space-x-3">
					{currentTab === "Members" ? (
						session?.user?.email === email ? (
							<p className="text-xs capitalize text-gray-500">{role}</p>
						) : (
							<select
								className={cn(
									"border-border focus:border-muted-foreground focus:ring-muted-foreground text-muted-foreground rounded-md border text-xs",
									{
										"bg-secondary cursor-not-allowed":
											plan === "enterprise" && !isOwner,
									}
								)}
								value={role}
								disabled={plan === "enterprise" && !isOwner}
								onChange={(e) => {
									setRole(e.target.value as "OWNER" | "MEMBER");
									setOpenPopover(false);
									setShowEditRoleModal(true);
								}}
							>
								<option value="OWNER">Owner</option>
								<option value="MEMBER">Member</option>
							</select>
						)
					) : (
						<p
							className="text-muted-foreground text-xs"
							suppressHydrationWarning
						>
							Invited {timeAgo(createdAt)}
						</p>
					)}

					<Popover
						content={
							<div className="grid w-full gap-1 p-2 sm:w-48">
								<button
									onClick={() => {
										setOpenPopover(false);
										setShowRemoveTeammateModal(true);
									}}
									className="text-destructive hover:bg-destructive rounded-md p-2 text-left text-sm font-medium transition-all duration-75 hover:text-white"
								>
									<IconMenu
										text={
											session?.user?.email === email
												? "Leave workspace"
												: currentTab === "Members"
												? "Remove teammate"
												: "Revoke invite"
										}
										icon={<UserMinus className="h-4 w-4" />}
									/>
								</button>
							</div>
						}
						align="end"
						openPopover={openPopover}
						setOpenPopover={setOpenPopover}
					>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								setOpenPopover(!openPopover);
							}}
							className={cn(
								buttonVariants({ variant: "link", size: "sm" }),
								"text-muted-foreground"
							)}
						>
							<span className="sr-only">Edit</span>
							<ThreeDots className="text-muted-foreground h-5 w-5" />
						</button>
					</Popover>
				</div>
			</div>
		</>
	);
};

const UserPlaceholder = () => (
	<div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
		<div className="flex items-center space-x-3">
			<div className="bg-secondary h-10 w-10 animate-pulse rounded-full" />
			<div className="flex flex-col">
				<div className="bg-secondary h-4 w-24 animate-pulse rounded" />
				<div className="bg-secondary mt-1 h-3 w-32 animate-pulse rounded" />
			</div>
		</div>
		<div className="bg-secondary h-3 w-24 animate-pulse rounded" />
	</div>
);

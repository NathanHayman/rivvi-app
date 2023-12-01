"use client";

import { toast } from "sonner";
import { createWorkspace } from "@/lib/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@phunq/utils";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useDebounce } from "use-debounce";
import {
	generatePreviewUrl,
	HOME_DOMAIN,
	SWIPE_REVEAL_ANIMATION_SETTINGS,
} from "@phunq/utils";
import slugify from "@sindresorhus/slugify";
import {
	InfoTooltip,
	Input,
	Label,
	Logo,
	Modal,
	Switch,
	Tooltip,
	TooltipContent,
} from "@phunq/ui";
import { AnimatePresence, motion } from "framer-motion";

function AddEditWorkspaceModalHelper({
	showAddEditWorkspaceModal,
	setShowAddEditWorkspaceModal,
}: {
	showAddEditWorkspaceModal: boolean;
	setShowAddEditWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [slugError, setSlugError] = useState<string | null>(null);
	const [domainError, setDomainError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [isOnboarding, setIsOnboarding] = useState(false);
	const [addCustomDomain, setShowAddCustomDomain] = useState(false);

	let plan = "free";

	const [data, setData] = useState<{
		name: string;
		slug: string;
		domain: string;
	}>({
		name: "",
		slug: "",
		domain: "",
	});
	const { name, slug, domain } = data;

	useEffect(() => {
		setSlugError(null);
		setDomainError(null);
		setData((prev) => ({
			...prev,
			slug: slugify(name),
			domain: generatePreviewUrl(slugify(name)),
		}));
	}, [name]);

	const onboardingFlow = pathname === "/onboarding";
	useEffect(() => {
		if (onboardingFlow) {
			setIsOnboarding(true);
		}
	}, [onboardingFlow]);

	// if the url is /onboarding?type=workspace?custom=true then we want to show the custom domain option and not the root domain option
	const customDomain = searchParams?.get("custom");
	const [showCustomDomain, setShowCustomDomain] = useState<boolean>(false);
	useEffect(() => {
		if (customDomain === "true") {
			setShowCustomDomain(true);
		}
	}, [customDomain]);

	return (
		<Modal
			showModal={showAddEditWorkspaceModal}
			setShowModal={setShowAddEditWorkspaceModal}
			preventDefaultClose={onboardingFlow}
			{...(onboardingFlow && { onClose: () => router.back() })}
		>
			<div className="border-modal bg-background flex h-fit flex-col items-center justify-center space-y-3 border-b px-4 pb-8 pt-8 transition-all md:sticky md:top-0 md:px-16">
				<Logo />
				<h3 className="text-lg font-medium">Create a new workspace</h3>
				<a
					href={`${HOME_DOMAIN}/help/article/what-is-a-workspace`}
					target="_blank"
					rel="noopener noreferrer"
					className="-translate-y-2 text-center text-xs text-gray-500 underline underline-offset-4 hover:text-gray-800"
				>
					What is a workspace?
				</a>
			</div>
			<form
				action={async (data: FormData) =>
					createWorkspace(data).then(async (res: any) => {
						if (res.status === 200) {
							// track workspace creation event
							va.track("Created Workspace");
							router.refresh();
							if (onboardingFlow) {
								router.push(`/onboarding?type=upgrade&workspaceSlug=${slug}`);
							} else {
								router.push(`/${slug}`);
								toast.success("Successfully created workspace!");
								setShowAddEditWorkspaceModal(false);
							}
						} else if (res.status === 422) {
							const {
								slugError: slugErrorResponse,
								domainError: domainErrorResponse,
							} = await res.json();

							if (slugErrorResponse) {
								setSlugError(slugErrorResponse);
								toast.error(slugErrorResponse);
							}
							if (domainErrorResponse) {
								setDomainError(domainErrorResponse);
								toast.error(domainErrorResponse);
							}
						} else {
							toast.error(res.statusText);
						}
						setSaving(false);
					})
				}
				className="bg-modal flex flex-col space-y-6 px-4 py-8 pt-6 text-left sm:px-8"
			>
				{/* WORKSPACE NAME */}
				<div>
					<Label htmlFor="name" className="flex items-center space-x-2">
						<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Workspace Name
						</p>
						<InfoTooltip content="This is the name of your workspace." />
					</Label>
					<div className="mt-2 flex rounded-md shadow-sm">
						<Input
							name="name"
							id="name"
							type="text"
							required
							autoFocus
							autoComplete="off"
							placeholder="Phunq It Up"
							value={name}
							onChange={(e) => {
								setData({ ...data, name: e.target.value });
							}}
							aria-invalid="true"
						/>
					</div>
				</div>

				{/* WORKSPACE SLUG (HIDDEN INPUT) */}
				<input
					type="hidden"
					name="slug"
					value={slug}
					onChange={(e) => {
						alert("slug changed");
						setSlugError(null);
						setData({ ...data, slug: e.target.value });
					}}
					aria-invalid="true"
				/>

				{/* PHUNQ.APP DOMAIN */}
				<div>
					<div className="flex items-center justify-between">
						<Label htmlFor="domain" className="flex items-center space-x-2">
							<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Phunq Domain
							</p>
							<InfoTooltip content="HELP TEXT" />
						</Label>
					</div>
					<div className="disabled border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring bg-accent mt-2 flex h-10 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
						{domain}
						<Input
							type="text"
							name="domain"
							id="domain"
							className="hidden"
							value={domain}
							onChange={(e) => {
								setData({ ...data, domain: e.target.value });
							}}
						/>
					</div>
				</div>

				{/* CUSTOM DOMAIN TOGGLE */}
				{!isOnboarding && (
					<div className="bg-background flex items-center justify-between">
						<div className="flex w-full items-center space-x-2 pb-1">
							<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Add a custom domain
							</p>
							<InfoTooltip content="The root domain of your workspace." />
						</div>
						<Switch
							// fn needs to set the state of showCustomDomain
							fn={() => {
								setShowAddCustomDomain(!addCustomDomain);
							}}
							checked={addCustomDomain}
							disabled={false}
							// disabled={props?.primary}
						/>
					</div>
				)}

				{/* CUSTOM LANDING PAGE */}
				<AnimatePresence initial={false}>
					{addCustomDomain && (
						<motion.div key="type" {...SWIPE_REVEAL_ANIMATION_SETTINGS}>
							<label
								htmlFor="target"
								className="block text-sm font-medium text-gray-700"
							>
								Landing Page
							</label>
							{plan !== "free" ? (
								<div className="relative mt-1 rounded-md shadow-sm">
									<input
										type="url"
										name="target"
										id="target"
										className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
										placeholder="https://example.com"
										// value={target}
										// onChange={(e) => setData({ ...data, target: e.target.value })}
									/>
								</div>
							) : (
								<Tooltip
									content={
										<TooltipContent
											title="You can't configure a custom landing page on a free plan. Upgrade to a Pro plan to proceed."
											cta="Upgrade to Pro"
											// onClick={() => {
											//   setShowAddEditDomainModal(false);
											//   setShowUpgradePlanModal(true);
											// }}
										/>
									}
									fullWidth
								>
									<div className="mt-1 w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-left text-sm text-gray-300 sm:max-w-md">
										https://yourdomain.com
									</div>
								</Tooltip>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				<CreateWorkspaceFormButton />
			</form>
		</Modal>
	);
}
function CreateWorkspaceFormButton() {
	const { pending } = useFormStatus();
	return (
		<button
			className={cn(
				"flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
				pending
					? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
					: "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
			)}
			disabled={pending}
		>
			{pending ? <LoadingDots color="#808080" /> : <p>Create Workspace</p>}
		</button>
	);
}

export function useAddEditWorkspaceModal() {
	const [showAddEditWorkspaceModal, setShowAddEditWorkspaceModal] = useState(
		false
	);

	const AddEditWorkspaceModal = useCallback(() => {
		return (
			<AddEditWorkspaceModalHelper
				showAddEditWorkspaceModal={showAddEditWorkspaceModal}
				setShowAddEditWorkspaceModal={setShowAddEditWorkspaceModal}
			/>
		);
	}, [showAddEditWorkspaceModal, setShowAddEditWorkspaceModal]);

	return useMemo(
		() => ({ setShowAddEditWorkspaceModal, AddEditWorkspaceModal }),
		[setShowAddEditWorkspaceModal, AddEditWorkspaceModal]
	);
}

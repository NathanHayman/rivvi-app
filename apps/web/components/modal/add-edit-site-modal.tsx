"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@phunq/utils";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { HOME_DOMAIN } from "@phunq/utils";
import { Input, Label, Logo, Modal, Textarea } from "@phunq/ui";
import { SiteProps } from "@/lib/types";

function AddEditSiteModalHelper({
	showAddEditSiteModal,
	setShowAddEditSiteModal,
	props,
	duplicateProps,
	homepageDemo,
}: {
	showAddEditSiteModal: boolean;
	setShowAddEditSiteModal: Dispatch<SetStateAction<boolean>>;
	props?: SiteProps;
	duplicateProps?: SiteProps;
	homepageDemo?: boolean;
}) {
	const router = useRouter();

	const [data, setData] = useState({
		name: "",
		subdomain: "",
		description: "",
	});

	useEffect(() => {
		setData((prev) => ({
			...prev,
			subdomain: prev.name
				.toLowerCase()
				.trim()
				.replace(/[\W_]+/g, "-"),
		}));
	}, [data.name]);

	return (
		<Modal
			showModal={showAddEditSiteModal}
			setShowModal={setShowAddEditSiteModal}
		>
			<div className="border-modal bg-background flex h-fit flex-col items-center justify-center space-y-3 border-b px-4 pb-8 pt-8 transition-all md:sticky md:top-0 md:px-16">
				<Logo />
				<h3 className="text-lg font-medium">Create a new site</h3>
				<a
					href={`${HOME_DOMAIN}/help/article/what-is-a-workspace`}
					target="_blank"
					rel="noopener noreferrer"
					className="-translate-y-2 text-center text-xs text-gray-500 underline underline-offset-4 hover:text-gray-800"
				>
					What is a site?
				</a>
			</div>
			<form
				action={async (data: FormData) =>
					createSite(data).then((res: any) => {
						if (res.error) {
							toast.error(res.error);
						} else {
							va.track("Created Site");
							const { id } = res;
							router.refresh();
							router.push(`/site/${id}`);
							setShowAddEditSiteModal(false);
							toast.success(`Successfully created site!`);
						}
					})
				}
				className="bg-modal flex flex-col space-y-6 px-4 py-8 pt-6 text-left sm:px-8"
			>
				<div className="flex flex-col space-y-2">
					<Label htmlFor="name">Site Name</Label>
					<Input
						name="name"
						type="text"
						placeholder="My Awesome Site"
						autoFocus
						value={data.name}
						onChange={(e) => setData({ ...data, name: e.target.value })}
						maxLength={32}
						required
					/>
				</div>

				<div className="flex flex-col space-y-2">
					<Label
						htmlFor="subdomain"
						className="text-sm font-medium text-stone-500"
					>
						Subdomain
					</Label>
					<div className="flex w-full max-w-md">
						<Input
							name="subdomain"
							type="text"
							placeholder="subdomain"
							value={data.subdomain}
							onChange={(e) => setData({ ...data, subdomain: e.target.value })}
							autoCapitalize="off"
							pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
							maxLength={32}
							required
						/>
						<div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
							.{process.env.NEXT_PUBLIC_USER_SUBDOMAIN}
						</div>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						name="description"
						placeholder="Description about why my site is so awesome"
						value={data.description}
						onChange={(e) => setData({ ...data, description: e.target.value })}
						maxLength={140}
						rows={3}
					/>
				</div>
				<CreateSiteFormButton />
			</form>
		</Modal>
	);
}
function CreateSiteFormButton() {
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
			{pending ? <LoadingDots color="#808080" /> : <p>Create Site</p>}
		</button>
	);
}

export function useAddEditSiteModal() {
	const [showAddEditSiteModal, setShowAddEditSiteModal] = useState(false);

	const AddEditSiteModal = useCallback(() => {
		return (
			<AddEditSiteModalHelper
				showAddEditSiteModal={showAddEditSiteModal}
				setShowAddEditSiteModal={setShowAddEditSiteModal}
			/>
		);
	}, [showAddEditSiteModal, setShowAddEditSiteModal]);

	return useMemo(() => ({ setShowAddEditSiteModal, AddEditSiteModal }), [
		setShowAddEditSiteModal,
		AddEditSiteModal,
	]);
}

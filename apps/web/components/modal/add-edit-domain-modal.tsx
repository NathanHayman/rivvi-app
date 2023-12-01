import {
	Button,
	buttonVariants,
	Input,
	Label,
	LoadingDots,
	Logo,
	Modal,
	Switch,
} from "@phunq/ui";
import { cn } from "@phunq/utils";
import { useParams, useRouter } from "next/navigation";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useDebounce } from "use-debounce";

import useWorkspace from "@/lib/swr/use-workspace";
import { DomainProps } from "@/lib/types";
import { BlurImage } from "@/ui/shared/blur-image";
import { AlertCircleFill, Lock } from "@/ui/shared/icons";

function AddEditDomainModal({
	showAddEditDomainModal,
	setShowAddEditDomainModal,
	props,
}: {
	showAddEditDomainModal: boolean;
	setShowAddEditDomainModal: Dispatch<SetStateAction<boolean>>;
	props?: DomainProps;
}) {
	const router = useRouter();
	const { workspaceSlug } = useParams() as { workspaceSlug: string };
	const { logo } = useWorkspace();

	const [data, setData] = useState<DomainProps>(
		props || {
			slug: "",
			verified: false,
			primary: false,
			target: "",
			type: "redirect",
			clicks: 0,
		}
	);

	const { slug: domain, primary } = data;

	const [debouncedDomain] = useDebounce(domain, 500);
	useEffect(() => {
		if (debouncedDomain.length > 0 && debouncedDomain !== props?.slug) {
			fetch(`/api/domains/${debouncedDomain}/exists`).then(async (res) => {
				if (res.status === 200) {
					const exists = await res.json();
					setDomainError(exists === 1 ? "Domain is already in use." : null);
				}
			});
		}
	}, [debouncedDomain]);

	const [lockDomain, setLockDomain] = useState(true);
	const [saving, setSaving] = useState(false);
	const [domainError, setDomainError] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const saveDisabled = useMemo(() => {
		/* 
      Disable save if:
      - modal is not open
      - saving is in progress
      - deleting is in progress
      - domain is invalid
      - for an existing domain, there's no changes
    */
		if (
			!showAddEditDomainModal ||
			saving ||
			deleting ||
			domainError ||
			(props &&
				Object.entries(props).every(([key, value]) => data[key] === value))
		) {
			return true;
		} else {
			return false;
		}
	}, [showAddEditDomainModal, saving, domainError, props, data]);

	const endpoint = useMemo(() => {
		if (props) {
			return {
				method: "PUT",
				url: `/api/workspaces/${workspaceSlug}/domains/${domain}`,
				successMessage: "Successfully updated domain!",
			};
		} else {
			return {
				method: "POST",
				url: `/api/workspaces/${workspaceSlug}/domains`,
				successMessage: "Successfully added domain!",
			};
		}
	}, [props]);

	async function deleteDomain() {
		setDeleting(true);
		fetch(`/api/workspaces/${workspaceSlug}/domains/${domain}`, {
			method: "DELETE",
		}).then(async (res) => {
			if (res.status === 200) {
				await Promise.all([
					mutate(`/api/workspaces/${workspaceSlug}/domains`),
					mutate(
						(key) =>
							typeof key === "string" &&
							key.startsWith(`/api/workspaces/${workspaceSlug}/sites`),
						undefined,
						{ revalidate: true }
					),
				]);
				setShowAddEditDomainModal(false);
				toast.success("Successfully deleted domain!");
			} else {
				setDomainError("Something went wrong. Please try again.");
			}
			setDeleting(false);
		});
	}

	return (
		<Modal
			showModal={showAddEditDomainModal}
			setShowModal={setShowAddEditDomainModal}
		>
			<div className="border-border flex flex-col items-center justify-center space-y-3 border-b px-4 py-4 pt-8 sm:px-16">
				{logo ? (
					<BlurImage
						src={logo}
						alt={`Logo for ${workspaceSlug}`}
						className="h-10 w-10 rounded-full border border-gray-200"
						width={20}
						height={20}
					/>
				) : (
					<Logo />
				)}
				<h3 className="text-lg font-medium">{props ? "Edit" : "Add"} Domain</h3>
			</div>

			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setSaving(true);
					fetch(endpoint.url, {
						method: endpoint.method,
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}).then(async (res) => {
						if (res.status === 200) {
							await mutate(`/api/workspaces/${workspaceSlug}/domains`);
							setShowAddEditDomainModal(false);
							toast.success(endpoint.successMessage);
							if (!props) {
								router.push(`/${workspaceSlug}/domains`);
							}
						} else {
							const errorMessage = await res.text();
							toast.error(errorMessage);
							if (res.status === 422) {
								setDomainError(errorMessage);
							}
						}
						setSaving(false);
					});
				}}
				className="bg-background flex flex-col space-y-6 px-4 py-8 text-left sm:px-16"
			>
				<div>
					<div className="flex items-center justify-between">
						<Label
							htmlFor="domain"
							className="text-foreground block text-sm font-medium"
						>
							Domain
						</Label>
						{props && lockDomain && (
							<button
								className="text-muted-foreground hover:text-foreground flex items-center space-x-2 text-sm transition-all duration-75 active:scale-95"
								type="button"
								onClick={() => {
									window.confirm(
										"Warning: Changing your workspaces's domain will break all existing pages and reset their analytics. Are you sure you want to continue?"
									) && setLockDomain(false);
								}}
							>
								<Lock className="h-3 w-3" />
								<p>Unlock</p>
							</button>
						)}
					</div>
					{props && lockDomain ? (
						<div className="border-secondary bg-secondary text-muted-foreground mt-2 cursor-not-allowed rounded-md border px-3 py-2 text-sm shadow-sm">
							{domain}
						</div>
					) : (
						<div className="relative mt-2 rounded-md shadow-sm">
							<Input
								type="text"
								name="domain"
								id="domain"
								required
								autoFocus
								autoComplete="off"
								pattern="[[\p{Letter}\p{Mark}\d-.]+"
								placeholder="yourdomain.com"
								className={cn(
									domainError ? "border-destructive" : "border-input"
								)}
								onChange={(e) => {
									setDomainError(null);
									setData({ ...data, slug: e.target.value });
								}}
								aria-invalid="true"
								aria-describedby="domain-error"
							/>
							{domainError && (
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
									<AlertCircleFill
										className="text-desctructive h-5 w-5"
										aria-hidden="true"
									/>
								</div>
							)}
						</div>
					)}
					{domainError &&
						(domainError === "Domain is already in use." ? (
							<p className="mt-1 text-sm text-red-600" id="domain-error">
								Domain is already in use.{" "}
								<a
									className="underline"
									href="mailto:support@phunq.io?subject=My Domain Is Already In Use"
								>
									Contact us
								</a>{" "}
								if you'd like to use this domain for your workspace.
							</p>
						) : (
							<p className="mt-1 text-sm text-red-600" id="domain-error">
								{domainError}
							</p>
						))}
				</div>

				<div className="bg-background flex items-center justify-between">
					<p className="text-foreground text-sm font-medium">Primary Domain</p>
					<Switch
						fn={() => setData((prev) => ({ ...prev, primary: !primary }))}
						checked={primary}
						disabled={props?.primary}
					/>
				</div>

				<div className="grid gap-2">
					<button
						className={cn(
							buttonVariants({ variant: "default", size: "lg" }),
							"w-full space-x-2"
						)}
						disabled={saveDisabled}
					>
						{saving && (
							<LoadingDots className="bg-primary-foreground dark:bg-foreground mr-4" />
						)}
						<p className="">{props ? "Save changes" : "Add Domain"}</p>
					</button>
					{props &&
						(props.primary ? (
							<Button
								disabledTooltip="You can't delete your primary domain."
								text="Delete domain"
							/>
						) : (
							<button
								onClick={() => {
									window.confirm(
										"Warning: Deleting your workspace's domain will delete all existing funnels using the domain. Are you sure you want to continue?"
									) && deleteDomain();
								}}
								className={cn(
									buttonVariants({ variant: "destructive", size: "lg" }),
									"w-full space-x-2"
								)}
							>
								{deleting && (
									<LoadingDots className="bg-primary-foreground dark:bg-foreground mr-4" />
								)}
								<p className="">Delete Domain</p>
							</button>
						))}
				</div>
			</form>
		</Modal>
	);
}

function AddEditDomainButton({
	setShowAddEditDomainModal,
}: {
	setShowAddEditDomainModal: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<button
			onClick={() => setShowAddEditDomainModal(true)}
			className={cn(
				buttonVariants({ variant: "default", size: "sm" }),
				"w-fit px-8"
			)}
		>
			Add Domain
		</button>
	);
}

export function useAddEditDomainModal({ props }: { props?: DomainProps } = {}) {
	const [showAddEditDomainModal, setShowAddEditDomainModal] = useState(false);

	const AddEditDomainModalCallback = useCallback(() => {
		return (
			<AddEditDomainModal
				showAddEditDomainModal={showAddEditDomainModal}
				setShowAddEditDomainModal={setShowAddEditDomainModal}
				props={props}
			/>
		);
	}, [showAddEditDomainModal, setShowAddEditDomainModal]);

	const AddEditDomainButtonCallback = useCallback(() => {
		return (
			<AddEditDomainButton
				setShowAddEditDomainModal={setShowAddEditDomainModal}
			/>
		);
	}, [setShowAddEditDomainModal]);

	return useMemo(
		() => ({
			setShowAddEditDomainModal,
			AddEditDomainModal: AddEditDomainModalCallback,
			AddEditDomainButton: AddEditDomainButtonCallback,
		}),
		[
			setShowAddEditDomainModal,
			AddEditDomainModalCallback,
			AddEditDomainButtonCallback,
		]
	);
}

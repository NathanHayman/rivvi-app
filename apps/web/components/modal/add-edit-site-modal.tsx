"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn, linkConstructor } from "@phunq/utils";
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
import punycode from "punycode/";
import {
	Input,
	Label,
	Logo,
	Modal,
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
	Textarea,
	buttonVariants,
} from "@phunq/ui";
import { DEFAULT_SITE_PROPS } from "@/lib/constants";
import { SiteProps } from "@/lib/types";
import slugify from "@sindresorhus/slugify";
import { useDebounce } from "use-debounce";
import useDomains from "@/lib/swr/use-domains";
import { AlertCircleFill, X } from "@/ui/shared/icons";
import { mutate } from "swr";
import Link from "next/link";

function AddEditSiteModal({
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
	const { workspaceSlug } = useParams() as { workspaceSlug: string };

	const [keyError, setkeyError] = useState<string | null>(null);
	const [nameError, setNameError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const { domains, primaryDomain } = useDomains() as {
		domains: { slug: string }[];
		primaryDomain: string;
	};

	const [data, setData] = useState<SiteProps>(
		props ||
			duplicateProps || {
				...DEFAULT_SITE_PROPS,
				domain:
					primaryDomain ||
					(domains && domains.length > 0 && domains[0].slug) ||
					"",
				name: "",
				key: "",
			}
	);

	const { domain, key, name } = data as {
		domain: string;
		key: string;
		name: string;
	};

	const [debouncedkey] = useDebounce(key, 500);
	useEffect(() => {
		/**
		 * Only check if key exists if:
		 * - modal is open
		 * - key is not empty
		 * - key is not the same as the original key
		 **/
		if (showAddEditSiteModal && debouncedkey !== props?.key && !keyError) {
			fetch(
				`/api/sites/${debouncedkey}/exists${
					workspaceSlug
						? `?workspaceSlug=${workspaceSlug}&domain=${domain}&key=${
								props?.key || key || ""
						  }`
						: ""
				}`
			).then(async (res) => {
				if (res.status === 200) {
					const exists = await res.text();
					setkeyError(exists ? "Slug already exists" : null);
				}
			});
		}
	}, [
		debouncedkey,
		domain,
		keyError,
		props?.key,
		key,
		showAddEditSiteModal,
		workspaceSlug,
	]);

	const endpoint = useMemo(() => {
		if (props?.key) {
			return {
				method: "PUT",
				url: `/api/sites/${props.key}${
					workspaceSlug
						? `?workspaceSlug=${workspaceSlug}&domain=${props.domain}&key=${
								props.key || key
						  }`
						: ""
				}`,
			};
		} else {
			return {
				method: "POST",
				url: `/api/sites${
					workspaceSlug
						? `?workspaceSlug=${workspaceSlug}&domain=${
								props?.domain || domain
						  }&key=${props?.key || key}`
						: ""
				}`,
			};
		}
	}, [props, workspaceSlug, domain, key]);

	const saveDisabled = useMemo(() => {
		/* 
		Disable save if:
		- modal is not open
		- saving is in progress
		- key is invalid
		- url is invalid
		- metatags is being generated
		- for an existing link, there's no changes
	  */
		if (
			!showAddEditSiteModal ||
			saving ||
			keyError ||
			nameError ||
			(props &&
				Object.entries(props).every(([key, value]) => {
					return data[key] === value;
				}))
		) {
			return true;
		} else {
			return false;
		}
	}, [showAddEditSiteModal, saving, keyError, nameError, props, data]);

	useEffect(() => {
		setkeyError(null);
		setNameError(null);
		setData((prev) => ({
			...prev,
			key: slugify(name || ""),
		}));
	}, [name]);

	const pathname = usePathname();

	const welcomeFlow = useMemo(() => {
		return pathname?.split("?")[0] === "/welcome";
	}, [pathname]);

	return (
		<>
			<Modal
				showModal={showAddEditSiteModal}
				setShowModal={setShowAddEditSiteModal}
				preventDefaultClose={homepageDemo ? false : true}
				{...(welcomeFlow && { onClose: () => router.back() })}
				className="m-auto max-h-fit w-fit max-w-md overflow-hidden border p-0 shadow-xl sm:max-w-lg md:rounded-2xl"
			>
				{!welcomeFlow && !homepageDemo && (
					<button
						onClick={() => setShowAddEditSiteModal(false)}
						className="text-muted-foreground hover:bg-accent active:bg-accent group absolute right-0 top-0 z-20 m-3 hidden rounded-full p-2 transition-all duration-75 focus:outline-none md:block"
					>
						<X className="h-5 w-5" />
					</button>
				)}

				<div className="border-modal bg-background flex h-fit flex-col items-center justify-center space-y-3 border-b px-4 pb-8 pt-8 transition-all md:sticky md:top-0 md:px-16">
					<h3 className="max-w-sm truncate text-lg font-medium">
						{props
							? `Edit ${linkConstructor({
									key: props.key || "",
									domain: punycode.toUnicode(props.domain || ""),
									pretty: true,
							  })}`
							: "Create a new site"}
					</h3>
				</div>

				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setSaving(true);
						// @ts-ignore – exclude the extra `user` attribute from `data` object before sending to API
						const { user, ...rest } = data;
						console.log(rest);
						fetch(endpoint.url, {
							method: endpoint.method,
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(rest),
						}).then(async (res) => {
							if (res.status === 200) {
								// track site creation event
								endpoint.method === "POST" &&
									va.track("Created Site", {
										type: key ? "Custom Domain" : "Default Domain",
									});
								await Promise.all([
									mutate(`/api/sites${key ? `/${key}` : ""}`),
									mutate(
										(key) =>
											typeof key === "string" &&
											key.startsWith(`/api/sites/_count`),
										undefined,
										{ revalidate: true }
									),
								]);
								// for welcome page, redirect to sites page after adding a sites
								if (pathname === "/app/welcome") {
									// await router.push("/sites");
									setShowAddEditSiteModal(false);
								} else if (!props) {
									// await router.push(`sites/${rest.key}`); // redirect to newly created site
									toast.success("Successfully created site!");
								} else {
									toast.success("Successfully updated site!");
								}
								setShowAddEditSiteModal(false);
							} else {
								const error = await res.text();
								if (error) {
									toast.error(error);
									if (error.toLowerCase().includes("key")) {
										setkeyError(error);
									} else if (error.toLowerCase().includes("name")) {
										setNameError(error);
									}
								} else {
									toast.error(res.statusText);
								}
							}
							setSaving(false);
						});
					}}
					className="bg-modal flex flex-col space-y-6 px-4 py-8 text-left sm:px-16"
				>
					<div>
						<div className="flex items-center justify-between">
							<Label
								htmlFor="name"
								className="text-foreground block text-sm font-medium"
							>
								Site Name
							</Label>
							{nameError && (
								<p className="text-destructive text-sm" id="key-error">
									Invalid name
								</p>
							)}
						</div>
						<div className="relative mt-2 flex rounded-md shadow-sm">
							<Input
								type="text"
								name="name"
								id="name"
								required
								placeholder="My Site"
								value={name!}
								autoFocus={!key}
								autoComplete="off"
								onChange={(e) => {
									setNameError(null);
									setData({ ...data, name: e.target.value });
								}}
								className={cn(
									nameError ? "border-destructive" : "border-input"
								)}
								aria-invalid="true"
							/>
							{nameError && (
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
									<AlertCircleFill
										className="text-destructive h-5 w-5"
										aria-hidden="true"
									/>
								</div>
							)}
						</div>
					</div>
					<div>
						<div className="flex items-center justify-between">
							<Label
								htmlFor={`key`}
								className="text-foreground block text-sm font-medium"
							>
								Site Slug
							</Label>
						</div>
						<div className="relative mt-2 flex rounded-md shadow-sm sm:rounded-l-md  sm:rounded-r-none">
							<Select
								onValueChange={(value) => setData({ ...data, domain: value })}
							>
								<SelectTrigger className="border-input text-foreground bg-accent w-fit rounded-l-md rounded-r-none border px-4 py-2 text-sm font-medium">
									<SelectValue
										placeholder={
											domain ? punycode.toUnicode(domain) : "Select a domain"
										}
										className="text-foreground w-fit text-left"
									/>
								</SelectTrigger>
								<SelectContent className="bg-background border-border z-[99999]">
									{domains?.map(({ slug: slug }) => (
										<SelectItem
											key={slug}
											value={slug}
											className="hover:bg-accent text-foreground cursor-pointer self-start text-left transition ease-in-out"
										>
											{punycode.toUnicode(slug || "")}
										</SelectItem>
									))}
									<SelectSeparator className="bg-accent" />
									<Link
										href={`/${workspaceSlug}/domains?modal=true`}
										className={cn(
											"text-muted-foreground mx-auto flex w-full items-center self-center text-center",
											buttonVariants({ variant: "link", size: "sm" })
										)}
									>
										Add a domain
									</Link>
								</SelectContent>
							</Select>
							<Input
								name="key"
								id="key"
								type="text"
								required
								autoComplete="off"
								pattern="[a-zA-Z0-9\-]+"
								placeholder="my-cool-site"
								value={key!}
								onChange={(e) => {
									setkeyError(null);
									setData({ ...data, key: e.target.value });
								}}
								className={cn(
									"rounded-l-none",
									keyError ? "border-destructive" : "border-input"
								)}
								aria-invalid="true"
							/>
							{keyError && (
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
									<AlertCircleFill
										className="text-destructive h-5 w-5"
										aria-hidden="true"
									/>
								</div>
							)}
						</div>
					</div>

					<div>
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
							<p className="">{props ? "Save changes" : "Submit"}</p>
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
}

function AddEditSiteButton({
	setShowAddEditSiteModal,
}: {
	setShowAddEditSiteModal: Dispatch<SetStateAction<boolean>>;
}) {
	const { workspaceSlug } = useParams() as { workspaceSlug?: string };

	return (
		workspaceSlug && ( // only show exceeded usage tooltip if user is on a project page
			<button
				onClick={() => setShowAddEditSiteModal(true)}
				className={cn(
					buttonVariants({ variant: "default", size: "sm" }),
					"w-fit px-8"
				)}
			>
				<p>Create Site</p>
			</button>
		)
	);
}

export function useAddEditSiteModal({
	props,
	duplicateProps,
}: {
	props?: SiteProps;
	duplicateProps?: SiteProps;
} = {}) {
	const [showAddEditSiteModal, setShowAddEditSiteModal] = useState(false);

	const AddEditSiteModalCallback = useCallback(() => {
		return (
			<AddEditSiteModal
				showAddEditSiteModal={showAddEditSiteModal}
				setShowAddEditSiteModal={setShowAddEditSiteModal}
				props={props}
				duplicateProps={duplicateProps}
			/>
		);
	}, [showAddEditSiteModal, props, duplicateProps]);

	const AddEditSiteButtonCallback = useCallback(() => {
		return (
			<AddEditSiteButton setShowAddEditSiteModal={setShowAddEditSiteModal} />
		);
	}, [setShowAddEditSiteModal]);

	return useMemo(
		() => ({
			showAddEditSiteModal,
			setShowAddEditSiteModal,
			AddEditSiteModal: AddEditSiteModalCallback,
			AddEditSiteButton: AddEditSiteButtonCallback,
		}),
		[
			showAddEditSiteModal,
			setShowAddEditSiteModal,
			AddEditSiteModalCallback,
			AddEditSiteButtonCallback,
		]
	);
}

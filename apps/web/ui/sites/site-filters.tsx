import {
	LoadingSpinner,
	NumberTooltip,
	Switch,
	useRouterStuff,
} from "@phunq/ui";
import { nFormatter, SWIPE_REVEAL_ANIMATION_SETTINGS } from "@phunq/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Search, XCircle } from "lucide-react";
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import { useSession } from "next-auth/react";
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import useDomains from "@/lib/swr/use-domains";
import useSites from "@/lib/swr/use-sites";
import useSitesCount from "@/lib/swr/use-sites-count";
import { ModalContext } from "@/components/modal/provider";

export default function SiteFilters() {
	const { workspaceSlug } = useParams() as { workspaceSlug?: string };
	const { primaryDomain } = useDomains();
	const { data: domains } = useSitesCount({ groupBy: "domain" });

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { queryParams } = useRouterStuff();
	const searchInputRef = useRef(); // this is a hack to clear the search input when the clear button is clicked

	useEffect(() => {
		if (searchParams?.has("search")) {
			queryParams({
				set: { showArchived: "true" },
			});
		}
	}, [pathname, searchParams]);

	const showClearButton = useMemo(() => {
		return [
			"sort",
			"search",
			"domain",
			"userId",
			"tagId",
			"showArchived",
			"page",
		].some((param) => searchParams?.has(param));
	}, [searchParams]);

	return domains ? (
		<div className="grid w-full rounded-md bg-white px-5 lg:divide-y lg:divide-gray-300">
			<div className="grid gap-3 py-6">
				<div className="flex items-center justify-between">
					<h3 className="ml-1 mt-2 font-semibold">Filter Sites</h3>
					{showClearButton && <ClearButton searchInputRef={searchInputRef} />}
				</div>
				<SearchBox searchInputRef={searchInputRef} />
			</div>
			<DomainsFilter domains={domains} primaryDomain={primaryDomain} />
			{workspaceSlug && (
				<>
					<MySitesFilter />
				</>
			)}
			<ArchiveFilter />
		</div>
	) : (
		<div className="grid h-full gap-6 rounded-md bg-white p-5">
			<div className="h-[400px] w-full animate-pulse rounded-md bg-gray-200" />
		</div>
	);
}

const ClearButton = ({ searchInputRef }) => {
	const router = useRouter();
	const { workspaceSlug } = useParams() as { workspaceSlug?: string };
	return (
		<button
			onClick={() => {
				router.replace(`/${workspaceSlug || "funnels"}`);
				searchInputRef.current.value = "";
			}}
			className="group flex items-center justify-center space-x-1 rounded-md border border-gray-400 px-2 py-1 transition-all hover:border-gray-600 active:bg-gray-100"
		>
			<XCircle className="h-4 w-4 text-gray-500 transition-all group-hover:text-black" />
			<p className="text-sm text-gray-500 transition-all group-hover:text-black">
				Clear
			</p>
		</button>
	);
};

const SearchBox = ({ searchInputRef }) => {
	const searchParams = useSearchParams();
	const { queryParams } = useRouterStuff();
	const debounced = useDebouncedCallback((value) => {
		queryParams({
			set: {
				search: value,
			},
			del: "page",
		});
	}, 500);
	const { isValidating } = useSites();

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		const target = e.target as HTMLElement;
		// only focus on filter input when:
		// - user is not typing in an input or textarea
		// - there is no existing modal backdrop (i.e. no other modal is open)
		if (
			e.key === "/" &&
			target.tagName !== "INPUT" &&
			target.tagName !== "TEXTAREA"
		) {
			e.preventDefault();
			searchInputRef.current?.focus();
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onKeyDown]);

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				{isValidating && searchInputRef.current?.value.length > 0 ? (
					<LoadingSpinner className="h-4 w-4" />
				) : (
					<Search className="h-4 w-4 text-gray-400" />
				)}
			</div>
			<input
				ref={searchInputRef}
				type="text"
				className="peer w-full rounded-md border border-gray-300 pl-10 text-black placeholder:text-gray-400 focus:border-black focus:ring-0 sm:text-sm"
				placeholder="Search..."
				defaultValue={searchParams?.get("search") || ""}
				onChange={(e) => {
					debounced(e.target.value);
				}}
			/>
		</div>
	);
};

const DomainsFilter = ({ domains, primaryDomain }) => {
	const { workspaceSlug } = useParams() as { workspaceSlug?: string };
	const searchParams = useSearchParams();
	const { queryParams } = useRouterStuff();

	const [collapsed, setCollapsed] = useState(false);

	const options = useMemo(() => {
		return domains.length === 0
			? [
					{
						value: primaryDomain || "",
						count: 0,
					},
			  ]
			: domains.map(({ domain, _count }) => ({
					value: domain,
					count: _count,
			  }));
	}, [domains, primaryDomain]);

	const {
		setShowAddEditDomainModal,
		setShowAddEditWorkspaceModal,
	} = useContext(ModalContext);

	return (
		<fieldset className="overflow-hidden py-6">
			<div className="flex h-8 items-center justify-between">
				<button
					onClick={() => {
						setCollapsed(!collapsed);
					}}
					className="flex items-center space-x-2"
				>
					<ChevronRight
						className={`${collapsed ? "" : "rotate-90"} h-5 w-5 transition-all`}
					/>
					<h4 className="font-medium text-gray-900">Domains</h4>
				</button>
				<button
					onClick={() => {
						if (workspaceSlug) {
							setShowAddEditDomainModal(true);
						} else {
							setShowAddEditWorkspaceModal(true);
							toast.error(
								"You can only add a domain to a custom workspace. Please create a new workspace or navigate to an existing one."
							);
						}
					}}
					className="rounded-md border border-gray-200 px-3 py-1 transition-all hover:border-gray-600 active:bg-gray-100"
				>
					<p className="text-sm text-gray-500">Add</p>
				</button>
			</div>
			<AnimatePresence initial={false}>
				{!collapsed && (
					<motion.div
						className="mt-4 grid gap-2"
						{...SWIPE_REVEAL_ANIMATION_SETTINGS}
					>
						{options?.map(({ value, count }) => (
							<div
								key={value}
								className="relative flex cursor-pointer items-center space-x-3 rounded-md bg-gray-50 transition-all hover:bg-gray-100"
							>
								<input
									id={value}
									name={value}
									checked={
										searchParams?.get("domain") === value || domains.length <= 1
									}
									onChange={() => {
										queryParams({
											set: {
												domain: value,
											},
											del: "page",
										});
									}}
									type="radio"
									className="ml-3 h-4 w-4 cursor-pointer rounded-full border-gray-300 text-black focus:outline-none focus:ring-0"
								/>
								<label
									htmlFor={value}
									className="flex w-full cursor-pointer justify-between px-3 py-2 pl-0 text-sm font-medium text-gray-700"
								>
									<p className="truncate">{value}</p>
									<NumberTooltip value={count} unit="sites">
										<p className="text-gray-500">{nFormatter(count)}</p>
									</NumberTooltip>
								</label>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</fieldset>
	);
};

const MySitesFilter = () => {
	const searchParams = useSearchParams();
	const { queryParams } = useRouterStuff();
	const userId = searchParams?.get("userId");
	const { data: session } = useSession();

	return (
		<div className="flex items-center justify-between py-6">
			<label className="text-sm font-medium text-gray-600">
				Show my sites only
			</label>
			<Switch
				fn={() =>
					queryParams(
						userId
							? { del: "userId" }
							: {
									set: {
										// @ts-ignore
										userId: session?.user?.id,
									},
							  }
					)
				}
				checked={userId ? true : false}
			/>
		</div>
	);
};

const ArchiveFilter = () => {
	const searchParams = useSearchParams();
	const { queryParams } = useRouterStuff();
	const showArchived = searchParams?.get("showArchived");
	return (
		<div className="flex items-center justify-between py-6">
			<label className="text-sm font-medium text-gray-600">
				Include archived sites
			</label>
			<Switch
				fn={() =>
					queryParams(
						showArchived
							? { del: "showArchived" }
							: {
									set: {
										showArchived: "true",
									},
							  }
					)
				}
				checked={showArchived ? true : false}
			/>
		</div>
	);
};

"use client";

import { Button, InfoTooltip, NumberTooltip } from "@phunq/ui";
import { fetcher, getFirstAndLastDay, nFormatter } from "@phunq/utils";
import va from "@vercel/analytics";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import useWorkspace from "@/lib/swr/use-workspace";
import { ModalContext } from "@/components/modal/provider";
import { Divider, InfinityIcon } from "@/ui/shared/icons";
import PlanBadge from "@/ui/workspaces/plan-badge";

export default function WorkspaceBillingClient() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { slug, plan, usage, usageLimit, billingCycleStart } = useWorkspace();

	const { data: funnels } = useSWR<number>(
		`/api/workspaces/${slug}/funnels/count`,
		fetcher
	);
	const [clicked, setClicked] = useState(false);

	const [billingStart, billingEnd] = useMemo(() => {
		if (billingCycleStart) {
			const { firstDay, lastDay } = getFirstAndLastDay(billingCycleStart);
			const start = firstDay.toLocaleDateString("en-us", {
				month: "short",
				day: "numeric",
			});
			const end = lastDay.toLocaleDateString("en-us", {
				month: "short",
				day: "numeric",
			});
			return [start, end];
		}
		return [];
	}, [billingCycleStart]);

	const { setShowUpgradePlanModal } = useContext(ModalContext);

	useEffect(() => {
		if (searchParams?.get("success")) {
			toast.success("Upgrade success!");
			setTimeout(() => {
				mutate(`/api/workspaces/${slug}`);
				// track upgrade to pro event
				va.track("Upgraded Plan", {
					plan: "pro",
				});
			}, 1000);
		}
	}, [searchParams, slug]);

	return (
		<>
			<div className="border-border rounded-lg border">
				<div className="flex flex-col space-y-3 p-10">
					<h2 className="text-xl font-medium">Plan &amp; Usage</h2>
					<p className="text-muted-foreground text-sm">
						You are currently on the{" "}
						{plan ? (
							<PlanBadge plan={plan} />
						) : (
							<span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-xs">
								load
							</span>
						)}{" "}
						plan.
						{billingStart && billingEnd && (
							<>
								{" "}
								Current billing cycle:{" "}
								<span className="text-foreground font-medium">
									{billingStart} - {billingEnd}
								</span>
								.
							</>
						)}
					</p>
				</div>
				<div className="border-border border-b" />
				<div className="divide-border grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
					<div className="p-10">
						<div className="flex items-center space-x-2">
							<h3 className="font-medium">Total Funnel Clicks</h3>
							<InfoTooltip content="Number of billable funnel clicks across all your workspaces." />
						</div>
						{/* {plan === "enterprise" ? (
              <div className="mt-4 flex items-center">
                {usage || usage === 0 ? (
                  <Number value={usage}>
                    <p className="text-2xl font-semibold text-black">
                      {nFormatter(usage)}
                    </p>
                  </Number>
                ) : (
                  <div className="h-8 w-8 animate-pulse rounded-md bg-slate-6" />
                )}
                <Divider className="h-8 w-8 text-muted-foreground" />
                <InfinityIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <div className="mt-2 flex flex-col space-y-2">
                {usage !== undefined && usageLimit ? (
                  <p className="text-sm text-gray-600">
                    <Number value={usage}>
                      <span>{nFormatter(usage)} </span>
                    </Number>
                    / {nFormatter(usageLimit)} clicks (
                    {((usage / usageLimit) * 100).toFixed(1)}%)
                  </p>
                ) : (
                  <div className="h-5 w-32 animate-pulse rounded-md bg-slate-6" />
                )}
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        usage !== undefined && usageLimit
                          ? (usage / usageLimit) * 100 + "%"
                          : "0%",
                    }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className={`${
                      usage && usageLimit && usage > usageLimit
                        ? "bg-red-500"
                        : "bg-blue-500"
                    } h-3 rounded-full`}
                  />
                </div>
              </div>
            )} */}
					</div>
					<div className="p-10">
						<div className="flex items-center space-x-2">
							<h3 className="font-medium">Number of Funnels</h3>
							<InfoTooltip content="Number of funnels in your workspace." />
						</div>
						<div className="mt-4 flex items-center">
							{funnels || funnels === 0 ? (
								<NumberTooltip value={funnels} unit="funnels">
									<p className="text-foreground text-2xl font-semibold">
										{nFormatter(funnels)}
									</p>
								</NumberTooltip>
							) : (
								<div className="bg-secondary h-8 w-8 animate-pulse rounded-md" />
							)}
							<Divider className="text-muted-foreground h-8 w-8" />
							<InfinityIcon className="text-muted-foreground h-8 w-8" />
						</div>
					</div>
				</div>
				<div className="border-border border-b" />
				<div className="flex flex-col items-center justify-between space-y-3 px-10 py-4 text-center sm:flex-row sm:space-y-0 sm:text-left">
					{plan ? (
						<p className="text-muted-foreground text-sm">
							{plan === "enterprise"
								? "On the Enterprise plan, the sky's the limit! Thank you for your support."
								: `For higher limits, upgrade to the ${
										plan === "free" ? "Pro" : "Enterprise"
								  } plan.`}
						</p>
					) : (
						<div className="bg-secondary h-3 w-28 animate-pulse rounded-full" />
					)}
					<div>
						{plan ? (
							plan === "free" ? (
								<Button
									text="Upgrade"
									onClick={() => setShowUpgradePlanModal(true)}
									variant="primary"
								/>
							) : (
								<Button
									text="Manage Subscription"
									onClick={() => {
										setClicked(true);
										fetch(`/api/workspaces/${slug}/billing/manage`, {
											method: "POST",
										})
											.then(async (res) => {
												const url = await res.json();
												router.push(url);
											})
											.catch((err) => {
												alert(err);
												setClicked(false);
											});
									}}
									loading={clicked}
								/>
							)
						) : (
							<div className="bg-secondary h-10 w-24 animate-pulse rounded-md" />
						)}
					</div>
				</div>
			</div>
		</>
	);
}

import { Button, LoadingCircle, LoadingDots, NumberTooltip } from "@phunq/ui";
import { fetcher, nFormatter } from "@phunq/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";

import { DomainProps, DomainVerificationStatusProps } from "@/lib/types";
import {
	AlertCircleFill,
	Chart,
	CheckCircleFill,
	ExternalLink,
	XCircleFill,
} from "@/ui/shared/icons";

import { useAddEditDomainModal } from "../../components/modal/add-edit-domain-modal";
import DomainConfiguration from "./domain-configuration";

export default function DomainCard({ props }: { props: DomainProps }) {
	const { workspaceSlug } = useParams() as { workspaceSlug: string };

	const { slug: domain, primary } = props || {};

	const { data, isValidating } = useSWR<{
		status: DomainVerificationStatusProps;
		response: any;
	}>(
		workspaceSlug &&
			`/api/workspaces/${workspaceSlug}/domains/${domain}/verify`,
		fetcher,
		{
			revalidateOnMount: true,
			refreshInterval: 5000,
		}
	);

	const {
		setShowAddEditDomainModal,
		AddEditDomainModal,
	} = useAddEditDomainModal({
		props,
	});

	return (
		<>
			<AddEditDomainModal />
			<div className="flex flex-col space-y-3 rounded-lg border px-5 py-8 sm:px-10">
				<div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-x-4">
					<div className="flex items-center space-x-2">
						<a
							href={`http://${domain}`}
							target="_blank"
							rel="noreferrer"
							className="flex items-center space-x-2"
						>
							<p className="flex items-center text-xl font-semibold">
								{domain}
							</p>
							<ExternalLink className="h-5 w-5" />
						</a>
						{primary && (
							<span className="rounded-full bg-blue-500 px-3 py-0.5 text-xs text-white">
								Primary Domain
							</span>
						)}
					</div>
					<div className="flex space-x-3">
						<Button
							text="Refresh"
							variant="secondary"
							loading={isValidating}
							onClick={() => {
								mutate(
									`/api/workspaces/${workspaceSlug}/domains/${domain}/verify`
								);
							}}
						/>
						<Button
							text="Edit"
							variant="secondary"
							onClick={() => setShowAddEditDomainModal(true)}
						/>
					</div>
				</div>
				<div className="flex h-10 flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-5 sm:space-y-0">
					<div className="flex items-center space-x-2">
						{data ? (
							data.status === "Valid Configuration" ? (
								<CheckCircleFill className="h-6 w-6 text-blue-500" />
							) : data.status === "Pending Verification" ? (
								<AlertCircleFill className="h-6 w-6 text-yellow-500" />
							) : (
								<XCircleFill className="h-6 w-6 text-red-500" />
							)
						) : (
							<LoadingCircle className="mr-1 h-5 w-5" />
						)}
						<p className="text-foreground text-sm">
							{data ? data.status : "Checking Domain Status"}
						</p>
					</div>
				</div>
				{data && data.status !== "Valid Configuration" && (
					<DomainConfiguration data={data} />
				)}
			</div>
		</>
	);
}

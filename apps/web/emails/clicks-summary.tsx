import { nFormatter, PHUNQ_LOGO, truncate } from "@phunq/utils";
import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { Link2, MousePointerClick } from "lucide-react";

import Footer from "./components/footer";

export default function ClicksSummary({
	email = "panic@thedis.co",
	workspaceName = "Acme",
	workspaceSlug = "acme",
	totalClicks = 63689,
	createdSites = 25,
	topSites = [
		{
			site: "acme.com/sales",
			clicks: 2187,
		},
		{
			site: "acme.com/instagram",
			clicks: 1820,
		},
		{
			site: "acme.com/facebook",
			clicks: 1552,
		},
		{
			site: "acme.com/twitter",
			clicks: 1229,
		},
		{
			site: "acme.com/linkedin",
			clicks: 1055,
		},
	],
}: {
	email: string;
	workspaceName: string;
	workspaceSlug: string;
	totalClicks: number;
	createdSites: number;
	topSites: {
		site: string;
		clicks: number;
	}[];
}) {
	return (
		<Html>
			<Head />
			<Preview>Your 30-day phunq summary for {workspaceName}</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src={PHUNQ_LOGO}
								width="40"
								height="40"
								alt="phunq"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
							Your 30-day phunq summary for {workspaceName}
						</Heading>
						<Text className="text-sm leading-6 text-black">
							In the last 30 days, your phunq workspace,{" "}
							<strong>{workspaceName}</strong> received{" "}
							<strong>{nFormatter(totalClicks)} link clicks</strong>. You also
							created <strong>{createdSites} new links</strong> during that
							time.
						</Text>
						<Section>
							<Row>
								<Column align="center">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
										<MousePointerClick className="h-5 w-5 text-blue-600" />
									</div>
									<p className="text-sm font-semibold text-black">
										{nFormatter(totalClicks)} clicks
									</p>
								</Column>
								<Column align="center">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
										<Link2 className="h-5 w-5 text-green-600" />
									</div>
									<p className="text-sm font-semibold text-black">
										{nFormatter(createdSites)} new links
									</p>
								</Column>
							</Row>
						</Section>
						{topSites.length > 0 && (
							<>
								<Text className="text-sm leading-6 text-black">
									Here are your top {topSites.length} best performing links:
								</Text>
								<Section>
									<Row className="pb-2">
										<Column align="left" className="text-sm text-gray-500">
											Link
										</Column>
										<Column align="right" className="text-sm text-gray-500">
											Clicks
										</Column>
									</Row>
									{topSites.map(({ site, clicks }, index) => (
										<div key={index}>
											<Row>
												<Column align="left" className="text-sm font-medium">
													{truncate(site, 30)}
												</Column>
												<Column align="right" className="text-sm text-gray-600">
													{nFormatter(clicks)}
												</Column>
											</Row>
											{index !== topSites.length - 1 && (
												<Hr className="my-2 w-full border border-gray-200" />
											)}
										</div>
									))}
								</Section>
							</>
						)}
						{createdSites === 0 ? (
							<>
								<Text className="text-sm leading-6 text-black">
									It looks like you haven't created any links in the last 30
									days. If there's anything that we can do to help, please reply
									to this email to get in touch with us.
								</Text>

								<Section className="my-8 text-center">
									<Link
										className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
										href={`https://app.rivvi.io/${workspaceSlug}`}
									>
										Start creating some links
									</Link>
								</Section>
							</>
						) : (
							<>
								<Text className="mt-10 text-sm leading-6 text-black">
									You can view your full stats by clicking the button below.
								</Text>
								<Section className="my-8 text-center">
									<Link
										className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
										href={`https://app.rivvi.io/${workspaceSlug}/analytics?interval=30d`}
									>
										View my stats
									</Link>
								</Section>
							</>
						)}
						<Footer email={email} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

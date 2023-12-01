import { PHUNQ_LOGO } from "@phunq/utils";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

import Footer from "./components/footer";

export default function DomainDeleted({
	email = "panic@thedis.co",
	domain = "rivvi.app",
	workspaceSlug = "rivvi",
}: {
	email: string;
	domain: string;
	workspaceSlug: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>Domain Deleted</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src={PHUNQ_LOGO}
								width="40"
								height="40"
								alt="rivvi"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
							Domain Deleted
						</Heading>
						<Text className="text-sm leading-6 text-black">
							Your domain <code className="text-purple-600">{domain}</code> for
							your rivvi workspace{" "}
							<Link
								href={`https://app.rivvi.io/${workspaceSlug}`}
								className="font-medium text-blue-600 no-underline"
							>
								{workspaceSlug}↗
							</Link>{" "}
							has been invalid for 30 days. As a result, it has been deleted
							from rivvi.
						</Text>
						<Text className="text-sm leading-6 text-black">
							If you would like to restore the domain, you can easily create it
							again on rivvi with the link below.
						</Text>
						<Section className="my-8 text-center">
							<Link
								className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={`https://app.rivvi.io/${workspaceSlug}/domains`}
							>
								Add a domain
							</Link>
						</Section>
						<Text className="text-sm leading-6 text-black">
							If you did not want to keep using this domain on rivvi anyway, you
							can simply ignore this email.
						</Text>
						<Footer email={email} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

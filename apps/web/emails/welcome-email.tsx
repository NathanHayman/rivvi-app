import { PHUNQ_LOGO, PHUNQ_THUMBNAIL } from "@phunq/utils";
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

export default function WelcomeEmail({
	name = "Brendon Urie",
	email = "panic@thedis.co",
}: {
	name: string | null;
	email: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>Welcome to Rivvi</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src={PHUNQ_LOGO}
								width="40"
								height="40"
								alt="Rivvi"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
							Welcome to Rivvi
						</Heading>
						<Section className="my-8">
							<Img
								src={PHUNQ_THUMBNAIL}
								alt="Rivvi"
								className="max-w-[500px]"
							/>
						</Section>
						<Text className="text-sm leading-6 text-black">
							Thanks for signing up{name && `, ${name}`}!
						</Text>
						<Text className="text-sm leading-6 text-black">
							My name is Steven, and I&apos;m the founder of Rivvi - the link
							management tool for modern marketing teams. I&apos;m excited to
							have you on board!
						</Text>
						<Text className="text-sm leading-6 text-black">
							Here are a few things you can do:
						</Text>
						<Text className="ml-1 text-sm leading-4 text-black">
							◆ Create a{" "}
							<Link
								href="https://app.rivvi.io/links"
								className="font-medium text-blue-600 no-underline"
							>
								Rivvi short link
							</Link>
						</Text>
						<Text className="ml-1 text-sm leading-4 text-black">
							◆ Create a{" "}
							<Link
								href="https://app.rivvi.io"
								className="font-medium text-blue-600 no-underline"
							>
								new workspace
							</Link>{" "}
							and add your custom domain
						</Text>
						<Text className="ml-1 text-sm leading-4 text-black">
							◆ Follow us on{" "}
							<Link
								href="https://twitter.com/rivviio"
								className="font-medium text-blue-600 no-underline"
							>
								Twitter
							</Link>
						</Text>
						<Text className="text-sm leading-6 text-black">
							Let me know if you have any questions or feedback. I&apos;m always
							happy to help!
						</Text>
						<Text className="text-sm font-light leading-6 text-gray-400">
							Nathan from Rivvi
						</Text>

						<Footer email={email} marketing />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

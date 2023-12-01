import { constructMetadata } from "@phunq/utils";

import OnboardingPageClient from "./_components/page-client";

export const metadata = constructMetadata({
	title: "Welcome to Rivvi",
});

export default function OnboardingPage() {
	return <OnboardingPageClient />;
}

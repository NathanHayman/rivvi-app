import { constructMetadata } from "@phunq/utils";

import FAQ from "@/ui/home/faq";
import Pricing from "@/ui/home/pricing";

export const metadata = constructMetadata({
	title: "Pricing – Rivvi",
});

export default function PricingPage() {
	return (
		<>
			<Pricing />
			<FAQ />
		</>
	);
}

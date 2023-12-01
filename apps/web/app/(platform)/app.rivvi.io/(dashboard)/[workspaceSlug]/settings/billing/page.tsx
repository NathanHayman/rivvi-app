import { Suspense } from "react";

import WorkspaceBillingClient from "./_components/page-client";

export default function WorkspaceBilling() {
	return (
		<Suspense>
			<WorkspaceBillingClient />
		</Suspense>
	);
}

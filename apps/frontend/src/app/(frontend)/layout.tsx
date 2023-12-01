import "@/styles/index.css";
import "tailwindcss/tailwind.css";

import { toPlainText } from "@portabletext/react";
import { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import { Footer } from "@/components/global/Footer";
import { Navbar } from "@/components/global/Navbar";
import MainWrap from "@/components/layout/wrap/main";
import { urlForOpenGraphImage } from "@/sanity/lib/utils";
import { loadHomePage, loadSettings } from "@/sanity/loader/loadQuery";

const VisualEditing = dynamic(() => import("@/sanity/loader/VisualEditing"));

export async function generateMetadata(): Promise<Metadata> {
	const [{ data: settings }, { data: homePage }] = await Promise.all([
		loadSettings(),
		loadHomePage(),
	]);

	const ogImage = urlForOpenGraphImage(settings?.ogImage);
	return {
		title: homePage?.header
			? {
					template: `%s | ${homePage.header}`,
					default: homePage.header || "Ruhe Template",
			  }
			: undefined,
		description: homePage?.header ? toPlainText(homePage.header) : undefined,
		// openGraph: {
		//   images: ogImage ? [ogImage] : [],
		// },
	};
}

export const viewport: Viewport = {
	themeColor: "#000",
};

export default async function IndexRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Suspense>
				<Navbar />
			</Suspense>
			<Suspense>
				<MainWrap>{children}</MainWrap>
			</Suspense>
			<Suspense>
				<Footer />
			</Suspense>
			{draftMode().isEnabled && <VisualEditing />}
		</>
	);
}

import "@/styles/globals.css";

import { cn, constructMetadata } from "@phunq/utils";
import { Analytics } from "@vercel/analytics/react";
import { Inter as FontSans } from "next/font/google";

import { inter, satoshi } from "@/styles/fonts";

import { Providers } from "./providers";

export const metadata = constructMetadata();

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn(satoshi.variable, inter.variable)}
			suppressHydrationWarning
		>
			<head>
				<link rel="stylesheet" href="https://use.typekit.net/zsv6yik.css" />
			</head>
			<body
				className={cn(
					"bg-background min-h-screen font-sans antialiased",
					fontSans.variable
				)}
			>
				<Providers>
					{children}
					<Analytics />
				</Providers>
			</body>
		</html>
	);
}

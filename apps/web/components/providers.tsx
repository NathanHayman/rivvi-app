"use client";

import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import ModalProvider from "@/components/modal/provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/ui/providers/theme";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<ModalProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster closeButton richColors />
					{children}
				</ThemeProvider>
			</ModalProvider>
			<Analytics />
		</SessionProvider>
	);
}

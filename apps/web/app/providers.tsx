"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import ModalProvider from "@/components/modal/provider";
import { ThemeProvider } from "@/ui/providers/theme";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem
				disableTransitionOnChange
			>
				<Toaster className="dark:hidden" />
				<Toaster theme="dark" className="hidden dark:block" />
				<ModalProvider>{children}</ModalProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}

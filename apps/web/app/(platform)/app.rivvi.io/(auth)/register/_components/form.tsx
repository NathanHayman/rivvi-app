"use client";

import { Button, Google } from "@phunq/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
	const searchParams = useSearchParams();
	const next = searchParams?.get("next");
	const [clickedGoogle, setClickedGoogle] = useState(false);

	useEffect(() => {
		const error = searchParams?.get("error");
		error && toast.error(error);
	}, [searchParams]);

	return (
		<>
			<Button
				text="Continue with Google"
				onClick={() => {
					setClickedGoogle(true);
					signIn("google", {
						...(next && next.length > 0 ? { callbackUrl: next } : {}),
					});
				}}
				loading={clickedGoogle}
				variant="primary"
				dotClassnames="bg-foreground dark:bg-accent"
				icon={<Google className="h-4 w-4" />}
			/>
			<p className="text-accent-foreground text-center text-sm">
				Already have an account?{" "}
				<Link
					href="/login"
					className="text-secondary-foreground hover:text-accent-foreground font-semibold transition-colors  duration-75 hover:underline"
				>
					Sign in
				</Link>
				.
			</p>
		</>
	);
}

"use client";

import { Button, Google, Input } from "@phunq/ui";
import { SWIPE_REVEAL_ANIMATION_SETTINGS } from "@phunq/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
	const searchParams = useSearchParams();
	const next = searchParams?.get("next");
	const [showEmailOption, setShowEmailOption] = useState(false);
	const [noSuchAccount, setNoSuchAccount] = useState(false);
	const [email, setEmail] = useState("");
	const [clickedGoogle, setClickedGoogle] = useState(false);
	const [clickedEmail, setClickedEmail] = useState(false);

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
					signIn("google");
					// signIn("google", {
					// 	...(next && next.length > 0 ? { callbackUrl: next } : {}),
					// });
				}}
				loading={clickedGoogle}
				disabled={clickedEmail}
				variant="primary"
				dotClassnames="bg-foreground dark:bg-accent"
				icon={<Google className="h-4 w-4" />}
			/>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setClickedEmail(true);
					fetch("/api/auth/account-exists", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email }),
					})
						.then(async (res) => {
							const { exists } = await res.json();
							if (exists) {
								signIn("email", {
									email,
									redirect: false,
									...(next && next.length > 0 ? { callbackUrl: next } : {}),
								}).then((res) => {
									setClickedEmail(false);
									if (res?.ok && !res?.error) {
										setEmail("");
										toast.success("Email sent - check your inbox!");
									} else {
										toast.error("Error sending email - try again?");
									}
								});
							} else {
								toast.error("No account found with that email address.");
								setNoSuchAccount(true);
								setClickedEmail(false);
							}
						})
						.catch(() => {
							setClickedEmail(false);
							toast.error("Error sending email - try again?");
						});
				}}
				className="flex flex-col space-y-3"
			>
				<AnimatePresence initial={false}>
					{showEmailOption && (
						<motion.div key="type" {...SWIPE_REVEAL_ANIMATION_SETTINGS}>
							<div className="mb-4 mt-1 border-t sm:mb-6" />
							<Input
								id="email"
								name="email"
								autoFocus
								type="email"
								placeholder="getphunqio@gmail.com"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => {
									setNoSuchAccount(false);
									setEmail(e.target.value);
								}}
								className="mt-1 block w-full appearance-none rounded-md border px-3 py-2 shadow-sm sm:text-sm"
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<Button
					text="Continue with Email"
					variant="secondary"
					{...(!showEmailOption && {
						type: "button",
						onClick: (e) => {
							e.preventDefault();
							setShowEmailOption(true);
						},
					})}
					dotClassnames="bg-foreground dark:bg-accent"
					loading={clickedEmail}
					disabled={clickedGoogle}
				/>
			</form>
			{noSuchAccount ? (
				<p className="text-center text-sm text-red-500">
					No such account.{" "}
					<Link href="/register" className="font-semibold text-red-600">
						Sign up
					</Link>{" "}
					instead?
				</p>
			) : (
				<p className="text-accent-foreground text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="text-secondary-foreground hover:text-accent-foreground font-semibold transition-all duration-75 hover:underline"
					>
						Sign up
					</Link>
					.
				</p>
			)}
		</>
	);
}

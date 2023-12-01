import { Button, Logo } from "@phunq/ui";
import { constructMetadata } from "@phunq/utils";
import { Suspense } from "react";

import LoginForm from "./_components/form";

export const metadata = constructMetadata({
	title: "Sign in - Rivvi",
});

export default function LoginPage() {
	return (
		<div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="bg-primary relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
				<div className="relative z-20 flex w-fit items-center justify-center text-lg font-medium leading-none sm:text-xl ">
					<Logo className="mr-2 h-8 w-8" />
					Rivvi
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;This library has saved me countless hours of work and
							helped me deliver stunning designs to my clients faster than ever
							before.&rdquo;
						</p>
						<footer className="text-sm">Sofia Davis</footer>
					</blockquote>
				</div>
			</div>
			{/* RIGHT SIDE */}
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-foreground text-xl font-bold leading-tight tracking-tight md:text-2xl ">
							Sign in to your account
						</h1>
						<p className="text-muted-foreground text-sm">
							Start creating today for free.
						</p>
					</div>
					<Suspense
						fallback={
							<>
								<Button disabled={true} text="" variant="secondary" />
								<Button disabled={true} text="" variant="secondary" />
								<Button disabled={true} text="" variant="secondary" />
								<div className="bg-accent-100 mx-auto h-5 w-3/4 rounded-lg" />
							</>
						}
					>
						<LoginForm />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

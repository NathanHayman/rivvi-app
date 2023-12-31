"use client";

import { buttonVariants } from "@phunq/ui";
import { cn, STAGGER_CHILD_VARIANTS } from "@phunq/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Intro() {
	const router = useRouter();

	return (
		<motion.div
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.3, type: "spring" }}
			className="shadow-primary/50 z-10 my-auto flex h-auto flex-col items-center justify-center rounded-md border p-5 text-center shadow-md backdrop-blur-lg transition-all sm:mx-auto bg-gradient-to-tr from-accent/50 to-primary-foreground/50"
		>
			<motion.div
				variants={{
					show: {
						transition: {
							staggerChildren: 0.2,
						},
					},
				}}
				initial="hidden"
				animate="show"
				className="mx-5 flex w-full flex-col items-center space-y-10 rounded-md p-16  text-center sm:mx-auto"
			>
				<motion.h1
					className="text-foreground font-brand-display text-4xl font-bold transition-colors sm:text-5xl"
					variants={STAGGER_CHILD_VARIANTS}
				>
					Welcome to Rivvi
				</motion.h1>
				<motion.p
					className="text-accent-foreground max-w-lg transition-colors sm:text-lg"
					variants={STAGGER_CHILD_VARIANTS}
				>
					We are a platform that allows you to create a website for your
					business within minutes.
				</motion.p>
				<motion.button
					variants={STAGGER_CHILD_VARIANTS}
					className={cn(
						buttonVariants({ variant: "default", size: "sm" }),
						"px-24 font-bold text-sm transition-all"
					)}
					onClick={() => router.push(`/onboarding${`?type=interim`}`)}
				>
					Get Started <span className="ml-2"> 👉</span>
				</motion.button>
			</motion.div>
		</motion.div>
	);
}

"use client";

import { Logo } from "@phunq/ui";
import { STAGGER_CHILD_VARIANTS } from "@phunq/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { BlurImage } from "@/ui/shared/blur-image";

export default function Interim() {
	const router = useRouter();
	return (
		<motion.div
			className="z-10 mx-5 my-auto flex flex-col items-center space-y-10 text-center sm:mx-auto"
			variants={{
				hidden: { opacity: 0, scale: 0.95 },
				show: {
					opacity: 1,
					scale: 1,
					transition: {
						staggerChildren: 0.2,
					},
				},
			}}
			initial="hidden"
			animate="show"
			exit="hidden"
			transition={{ duration: 0.3, type: "spring" }}
		>
			<motion.div
				variants={STAGGER_CHILD_VARIANTS}
				className="flex flex-col items-center space-y-5 text-center"
			>
				<Logo className="h-11 w-11" />
				<h1 className="font-display text-foreground text-3xl font-semibold transition-colors sm:text-4xl">
					Let's get started
				</h1>
			</motion.div>
			<motion.p
				className="text-foreground transition-colors sm:text-lg"
				variants={STAGGER_CHILD_VARIANTS}
			>
				Have your own domain? Start creating for free.{" "}
				<br className="hidden sm:block" />
				Don't have one? Use the default{" "}
				<p className="text-muted-foreground hover:text-foreground underline transition-colors">
					rivvi.app
				</p>{" "}
				domain to create a site.
			</motion.p>
			<motion.div
				variants={STAGGER_CHILD_VARIANTS}
				className="bg-background/20 divide-accent shadow-primary/50 grid w-full grid-cols-1 divide-y overflow-hidden rounded-md border shadow-md backdrop-blur-lg transition-all md:grid-cols-2 md:divide-x"
			>
				<button
					onClick={() => router.push("/onboarding?type=workspace&custom=true")}
					className="hover:bg-primary/70 hover:text-accent dark:hover:text-foreground hover:border-primary flex flex-col items-center justify-center overflow-hidden border-b p-5 transition-colors md:border-b-0 md:border-r md:p-10"
				>
					<BlurImage
						src="/_static/illustrations/shopping-call.svg"
						alt="No sites yet"
						width={250}
						height={250}
						className="pointer-events-none -mb-3 -mt-8 w-48 sm:w-60"
					/>
					<p>I have a domain</p>
				</button>
				<button
					onClick={() => router.push("/onboarding?type=workspace&custom=false")}
					className="hover:bg-primary/70 hover:text-accent dark:hover:text-foreground hover:border-primary flex flex-col items-center justify-center overflow-hidden border-none p-5 transition-colors md:p-10"
				>
					<BlurImage
						src="/_static/illustrations/call-waiting.svg"
						alt="No sites yet"
						width={250}
						height={250}
						className="pointer-events-none -mb-3 -mt-8 w-48 sm:w-60"
					/>
					<p>I don't have a domain</p>
				</button>
			</motion.div>
		</motion.div>
	);
}

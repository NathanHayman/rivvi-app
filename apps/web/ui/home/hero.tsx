"use client";

import { buttonVariants } from "@phunq/ui";
import { APP_DOMAIN, cn } from "@phunq/utils";
import Link from "next/link";

import React from "react";

const Hero: React.FC = () => {
	return (
		<div className="mx-auto mb-10 mt-12 w-full max-w-md px-2.5 text-center sm:max-w-lg sm:px-0 md:max-w-2xl">
			<h1
				data-testid="hero-text"
				className="font-display mt-5 text-4xl font-extrabold leading-[1.15] text-black sm:text-6xl sm:leading-[1.15]"
			>
				Design{" "}
				<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Brilliance
				</span>{" "}
				<br />
				Now Just a{" "}
				<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Click Away
				</span>
			</h1>
			<h2 className="mt-5 text-gray-600 sm:text-xl">
				Dive into a seamless experience where your marketing aspirations become
				visually stunning realities.
			</h2>

			<div className="mx-auto mt-10 flex max-w-fit space-x-4">
				<Link
					href={`${APP_DOMAIN}/register`}
					className={cn(buttonVariants({ variant: "default", size: "sm" }))}
				>
					Start For Free
				</Link>
			</div>
		</div>
	);
};

export default Hero;

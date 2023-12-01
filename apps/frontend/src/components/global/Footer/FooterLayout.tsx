import { CustomPortableText } from "@/components/studio/shared/custom-portable-text";
import { FooterProps } from "@/types";

import { FooterColumn } from "./FooterColumn";
import { FooterLeft } from "./FooterLeft";

export interface FooterPageProps {
	data: FooterProps;
}

export default function Footer({ data }: FooterPageProps) {
	const columns = data?.footerMenuItems;
	const footerText = data?.footerText;

	return (
		<footer className="bg-white" aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
				<div className=" lg:grid lg:grid-cols-3 lg:gap-8">
					<FooterLeft data={null} />
					<div className=" mt-16 grid w-full grid-cols-2 gap-8 place-self-end sm:grid-cols-3 lg:col-span-2 lg:mt-0 lg:w-fit lg:gap-14">
						{columns &&
							columns.map((item, key) => (
								<div className="w-full" key={key}>
									<FooterColumn data={item} type={item._type as string} />
								</div>
							))}
					</div>
				</div>
				{footerText && (
					<div className="mt-8 border-t border-gray-900/10 pt-8 md:flex md:items-center md:justify-center">
						<CustomPortableText
							paragraphClasses="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0"
							value={footerText}
						/>
					</div>
				)}
			</div>
		</footer>
	);
}

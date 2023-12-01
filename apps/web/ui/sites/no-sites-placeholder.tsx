import { BlurImage } from "@/ui/shared/blur-image";

export default function NoSitesPlaceholder({
	AddEditSiteButton,
}: {
	AddEditSiteButton: () => JSX.Element;
}) {
	return (
		<div className="mb-12 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
			<h2 className="z-10 text-xl font-semibold text-gray-700">
				No sites found.
			</h2>
			<BlurImage
				src="/_static/illustrations/call-waiting.svg"
				alt="No sites yet"
				width={400}
				height={400}
				className="pointer-events-none -my-8"
			/>
			<AddEditSiteButton />
			<p className="mt-2 text-sm text-gray-500">or edit your search filters</p>
		</div>
	);
}

export default function PlaceholderCard() {
	return (
		<div className="relative rounded-lg border pb-10 shadow-md transition-all hover:shadow-xl">
			<div className="h-44 w-full animate-pulse bg-secondary" />
			<div className="p-4">
				<div className="h-4 w-1/2 animate-pulse rounded-lg bg-secondary" />
				<div className="mt-2 h-3 w-3/4 animate-pulse rounded-lg bg-secondary" />
				<div className="mt-2 h-3 w-1/2 animate-pulse rounded-lg bg-secondary" />
			</div>
		</div>
	);
}

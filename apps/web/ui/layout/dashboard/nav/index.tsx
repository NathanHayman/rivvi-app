export function Nav({ children }: { children: React.ReactNode }) {
	return (
		<div className="border-border flex h-[60px] items-center justify-end border-b px-6">
			<div className="absolute left-0 top-0 z-40 flex w-full flex-col items-center md:hidden"></div>
			<div className="hidden items-center gap-4 md:flex">
				<div className="flex items-start justify-start px-4">{children}</div>
			</div>
		</div>
	);
}

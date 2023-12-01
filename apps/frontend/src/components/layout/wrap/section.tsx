export default function SectionWrap({
  children,
  fullWidth,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  if (fullWidth) {
    return <section className="w-full">{children}</section>;
  }
  return (
    <div className="py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24">{children}</div>
  );
}

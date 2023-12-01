export default function ContentWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl sm:px-4 lg:px-6 xl:px-8">{children}</div>
  );
}

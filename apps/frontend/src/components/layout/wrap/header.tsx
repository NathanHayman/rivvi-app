export default function HeaderWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-7xl py-3">{children}</div>;
}

export default function ModuleHeading({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="px-4 py-8 lg:px-6 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        {title && (
          <h1 className="mb-2 text-[2.15rem] font-semibold tracking-tight">
            {title}
          </h1>
        )}
        {subtitle && <p className="text-lg text-default-500">{subtitle}</p>}
      </div>
    </div>
  );
}

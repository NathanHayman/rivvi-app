export default function SectionHeading({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="px-4 py-4 lg:px-6 lg:py-6 lg:pt-24">
      <div className="mx-auto max-w-[45rem] text-center">
        {title && (
          <h1 className="inline text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="sm:text-lgs mt-4 px-2 text-base font-normal leading-8 text-default-500 lg:px-4 lg:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

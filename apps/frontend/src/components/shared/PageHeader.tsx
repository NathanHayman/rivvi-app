export function PageHeader({ title, subtitle }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-6 pt-4 sm:py-8 lg:px-8">
      <div className="">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:mb-4 md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="pb-2 text-lg font-normal text-gray-500 dark:text-gray-400 md:pb-3 lg:text-xl">
            {subtitle}
          </p>
        )}
        <hr className="mt-2 bg-black" />
      </div>
    </section>
  );
}

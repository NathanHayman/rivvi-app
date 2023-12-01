import Link from "next/link";

import { Service } from "@/types";

interface AllServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: AllServicesListProps) {
  return (
    <div className="w-full lg:space-y-4">
      {/* SERVICES GRID */}
      <ul className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services &&
          services.map((item, index) => (
            <li
              key={index}
              className="relative flex h-full max-w-sm flex-col items-start justify-between rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow duration-300 ease-in-out hover:shadow-lg"
            >
              <div>
                <Link href={`/services/${item.slug}`} className="mb-4">
                  <p className="mb-2 text-lg font-bold tracking-tight text-gray-900 ">
                    {item.title}
                  </p>
                </Link>
                {item.subtitle && (
                  <p className="mb-2 text-sm font-medium text-gray-600 ">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <Link
                href={`/services/${item.slug}`}
                title={`Learn more about ${item.title}`}
                className="bottom-0 flex items-center justify-center text-center text-sm font-medium text-blue-700"
              >
                Learn more
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

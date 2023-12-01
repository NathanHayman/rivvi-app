import Link from "next/link";

import { CalloutProps } from "@/types";

export default function Callout({ callout }: { callout: CalloutProps }) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-blue-600 p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto w-full text-center">
            {callout.text && (
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                {callout.text}
              </h2>
            )}

            {callout?.links && (
              <div className="mt-4 md:mt-8">
                {callout.links.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url || "/"}
                    title={link.title}
                    className="inline-block rounded border border-white bg-white px-12 py-3 text-sm font-medium text-blue-500 transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

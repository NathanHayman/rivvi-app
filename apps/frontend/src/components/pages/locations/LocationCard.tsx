import Link from "next/link";

import fromatAddress from "@/lib/hooks/fromat-address";
import { Location, LocationShort } from "@/types";

interface LocationCardProps {
  location: LocationShort | Location;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
}: LocationCardProps) => {
  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  const address = fromatAddress(location.address as any);

  return (
    <div className="flex w-full flex-col justify-between space-y-4 p-4 leading-normal lg:p-6">
      <div className="flex w-full items-center justify-start space-x-3 border-b pb-4">
        <Link href={`/locations/${location.slug}`} className="w-fit">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {location.name}
          </h5>
        </Link>
      </div>
      <div className="flex flex-col items-start justify-center space-y-4">
        <div className="flex h-full w-full flex-col items-start justify-center">
          <span className="text-[12px] font-medium tracking-wider text-gray-800 dark:text-gray-400">
            Address
          </span>
          <Link
            href={`/locations/${location.slug}`}
            target="_blank"
            className="pt-0 text-sm font-normal text-blue-700 hover:underline dark:text-gray-400"
          >
            {address}
          </Link>
        </div>
        <div className="flex h-full w-full flex-col items-start justify-center md:pt-2">
          <div className="flex w-full flex-row items-center justify-start space-x-2 md:justify-between lg:space-x-8">
            <Link
              href={`#`}
              target="_blank"
              className="rounded bg-blue-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Schedule Appointment
            </Link>
            <Link
              href={`/locations/${location.slug}`}
              className="flex place-content-end items-center justify-start text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              View Location{" "}
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;

"use client";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaMapPin } from "react-icons/fa";

import fromatAddress from "@/lib/hooks/fromat-address";
import { LocationShort } from "@/types";

import Styles from "./MapStyles";

const containerStyle = {
  width: "100%",
  height: "700px",
};

interface LocationsMapProps {
  locations: LocationShort[] | Location[];
  index?: number;
}

export default function LocationsMap({ locations, index }: LocationsMapProps) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapCenter = { lat: 39.36089, lng: -94.519 } as any;
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      // enable zoom control
      zoomControl: true,
      // enable Styles
      styles: Styles,
    }),
    [],
  );
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: key as string,
  });

  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState({} as any);

  return isLoaded ? (
    <GoogleMap
      options={mapOptions}
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={4.3}
    >
      <>
        {locations.map((location, key) => (
          <Marker
            key={key}
            position={{
              lat: location.address?.geoLocation?.lat,
              lng: location.address?.geoLocation?.lng,
            }}
            icon={{
              url: FaMapPin as any,
              scaledSize: new google.maps.Size(100, 100),
              // add number to go in the middle of the marker
              labelOrigin: new google.maps.Point(50, 50),
            }}
            onClick={() => {
              setSelected(location);
            }}
          ></Marker>
        ))}

        {selected.address?.geoLocation?.lat && (
          <InfoWindow
            position={{
              lat: selected.address?.geoLocation?.lat,
              lng: selected.address?.geoLocation?.lng,
            }}
            onCloseClick={() => setSelected({})}
          >
            <div>
              <p className="font-semibold text-gray-800">{selected.name}</p>
              <p>
                {fromatAddress(selected.address as any) || "No address found"}
              </p>
              <Link
                href={`/locations/${selected.slug}`}
                className="flex place-content-end items-center justify-start text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                View Location{" "}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </InfoWindow>
        )}
      </>
    </GoogleMap>
  ) : (
    <></>
  );
}

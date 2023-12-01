import type { EncodeDataAttributeCallback } from "@sanity/react-loader/rsc";

import type { ServicePayload } from "@/types";

export interface ServicePageProps {
  data: ServicePayload | null;
  encodeDataAttribute?: EncodeDataAttributeCallback;
}

export function ServicePage({ data, encodeDataAttribute }: ServicePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { title } = data ?? {};

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}

export default ServicePage;

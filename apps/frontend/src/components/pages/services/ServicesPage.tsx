import { PageHeader } from "@/components/shared/PageHeader";
import { Service, ServicesPagePayload, ServicesPayload } from "@/types";

import ModuleWrap from "@/components/layout/wrap/module";
import { ServicesList } from "./ServicesList";

export interface ServicesPageProps {
  services: ServicesPayload | null;
  pageData: ServicesPagePayload | null;
}

export function ServicesPage({ services, pageData }: ServicesPageProps) {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title={pageData?.header || "Services"}
        subtitle={pageData?.subheader || "Services Subtitle"}
      />
      {/* Services List */}
      <ModuleWrap>
        <ServicesList services={services as Service[]} />
      </ModuleWrap>
    </>
  );
}

export default ServicesPage;

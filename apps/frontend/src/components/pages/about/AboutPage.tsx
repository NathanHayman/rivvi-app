"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import Section from "@/components/studio/sections";
import { AboutPagePayload, AboutPayload, SectionProps } from "@/types";

interface AboutPageProps {
  data: AboutPayload | null;
  pageData: AboutPagePayload | null;
}

const AboutPage: React.FC<AboutPageProps> = ({ data, pageData }) => {
  // Default to an empty object to allow previews on non-existent documents
  const { sections } = data ?? {};
  return (
    <>
      {/* Header */}
      {/* {header && <Header title={header} />} */}
      <PageHeader
        title={pageData?.header || "About Us"}
        subtitle={
          pageData?.subheader || "We are a team of dedicated professionals."
        }
      />
      {/* Sections */}
      {sections &&
        sections.map((section: SectionProps) => (
          <Section section={section as SectionProps} key={section._key} />
        ))}
    </>
  );
};

export { AboutPage };

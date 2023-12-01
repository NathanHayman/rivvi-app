import type { EncodeDataAttributeCallback } from "@sanity/react-loader/rsc";

import ContentImageSplitTest from "@/components/studio/modules/content/test";
import Section from "@/components/studio/sections";
import type { HomePagePayload, SectionProps } from "@/types";

export interface HomePageProps {
  data: HomePagePayload | null;
  encodeDataAttribute?: EncodeDataAttributeCallback;
}

export function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { sections, header, footer } = data ?? {};

  return (
    <div className="space-y-20">
      {/* Header */}
      {/* {title && <Header centered title={title} description={overview} />} */}

      {/* Sections */}
      {sections &&
        sections.map((section, index: number) => {
          return (
            <Section
              section={section as SectionProps}
              key={section._key ?? index}
            />
          );
        })}
      <ContentImageSplitTest />
      {/* {sections &&
        sections.map((section: SectionProps, i: number) => (
          let key = `${section._key}-${i}`
          <Section section={section as SectionProps} key={section._key} />
        ))} */}

      {/* Showcase projects */}
      {/* {showcaseProjects && showcaseProjects.length > 0 && (
        <div className="mx-auto max-w-[100rem] rounded-md border">
          {showcaseProjects.map((project, key) => {
            const href = resolveHref(project._type, project.slug)
            if (!href) {
              return null
            }
            return (
              <Link
                key={key}
                href={href}
                data-sanity={encodeDataAttribute?.([
                  'showcaseProjects',
                  key,
                  'slug',
                ])}
              >
                <ProjectListItem project={project} odd={key % 2} />
              </Link>
            )
          })}
        </div>
      )} */}
    </div>
  );
}

export default HomePage;

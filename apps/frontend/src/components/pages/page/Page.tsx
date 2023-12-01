import PageTheme from "@/components/layout/theme/page";
import { Header } from "@/components/shared/Header";
import Section from "@/components/studio/sections";
import UseModal, { ModalProps } from "@/components/studio/shared/modal";
import { PageProps, SectionProps } from "@/types";

export type PagePayload = {
  data: PageProps;
};

const modalData = {
  size: "3xl",
  backdrop: "blur",
  escape: true,
  isOpen: true,
  isDismissable: false,
  placement: "auto",
  radius: "lg",
} as ModalProps;

const pageTheme = null;

export function Page({ data }: PagePayload) {
  // Default to an empty object to allow previews on non-existent documents
  const { sections, header, footer, pageType } = data ?? {};

  return (
    <>
      <PageTheme data={pageTheme as any}>
        {/* Header */}
        {header && <Header title={header} />}
        {/* Sections */}
        {sections &&
          sections.map((section: SectionProps) => (
            <Section section={section as SectionProps} key={section._key} />
          ))}
        <UseModal data={modalData as ModalProps} />
      </PageTheme>
    </>
  );
}

export default Page;

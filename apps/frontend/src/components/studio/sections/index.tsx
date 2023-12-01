import SectionWrap from "@/components/layout/wrap/section";
import ModuleSwitcher from "@/components/studio/shared/module-switcher";
import { SectionProps } from "@/types";

export default function Section({
  section, // theme,
}: {
  section: SectionProps;
  // theme: string
}) {
  const { modules, title, subtitle } = section;

  return (
    <SectionWrap>
      {/* {title && <SectionHeader title={title} subtitle={subtitle} />} */}
      <ModuleSwitcher modules={modules as any} /*theme={theme as string}*/ />
    </SectionWrap>
  );
}

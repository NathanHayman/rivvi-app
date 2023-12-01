import Heading from "@/components/studio/elements/heading/index";

export default function SectionHeader({
  title,
  subtitle,
  type,
}: {
  title?: string;
  subtitle?: string;
  type?: string;
}) {
  return <Heading title={title} subtitle={subtitle} type={type} />;
}

import Heading from "@/components/studio/elements/heading/index";
import { ContentHeaderProps } from "@/types";

export default function ContentHeader({ data }: { data: ContentHeaderProps }) {
  const { title, subtitle } = data ?? {};

  return <Heading title={title} subtitle={subtitle} type="module" />;
}

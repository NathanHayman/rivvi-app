import ModuleHeading from "./module";
import SectionHeading from "./section";

// import { HeadingProps } from "@/types"
export default function Heading({
  title,
  subtitle,
  type,
}: {
  title?: string;
  subtitle?: string;
  type?: string;
}) {
  switch (type) {
    case "section": {
      return <SectionHeading title={title} subtitle={subtitle} />;
    }
    case "module": {
      return <ModuleHeading title={title} subtitle={subtitle} />;
    }
  }
}

import { ContentBlock } from "@/components/studio/shared/blocks/content";

export default function ContentAll({ data }: { data: any }) {
  const { contentAllBody } = data ?? {};
  if (!contentAllBody) return null;
  return (
    <div className="prose mx-auto lg:prose-lg">
      <ContentBlock value={contentAllBody} paragraphClasses="" />
    </div>
  );
}

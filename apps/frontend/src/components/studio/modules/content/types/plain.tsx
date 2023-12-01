import { ContentBlock } from "@/components/studio/shared/blocks/content";

export default function ContentPlain({ data }: { data: any }) {
  const { allContentBody } = data ?? {};
  return (
    <div className="">
      {allContentBody && <ContentBlock value={allContentBody} />}
    </div>
  );
}

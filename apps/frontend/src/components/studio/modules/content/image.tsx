import { ContentImageProps } from "@/types";

import ContentImageSplit from "./content-image-split";

export default function ContentImage({ data }: { data: ContentImageProps }) {
  const { header, contentLayout, image, contentImageBody } = data ?? {};

  return (
    <>
      {contentLayout && (
        <ContentImageSplit
          image={image as any}
          contentImageBody={contentImageBody as any}
          contentLayout={contentLayout as any}
        />
      )}
      {/* {header && <ContentHeader data={header} />}
      {contentLayout && (
        <LayoutSwitchContent
          data={{ contentLayout, image, contentImageBody }}
        />
      )} */}
    </>
  );
}

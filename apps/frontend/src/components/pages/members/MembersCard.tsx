"use client";

import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";

import { urlForImage } from "@/sanity/lib/utils";
import { MemberShort } from "@/types/index";

interface MemberCardProps {
  member: MemberShort;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  if (!member) {
    return null;
  }

  const { image, title, name } = member;

  const imageUrl = image && urlForImage(image)?.url();

  return (
    <Card className="py-4">
      {imageUrl && (
        <CardHeader className="overflow-visible py-2">
          <Image
            className="rounded-xl object-cover"
            src={imageUrl}
            width={image?.asset?.metadata?.dimensions?.width || 819}
            height={image?.asset?.metadata?.dimensions?.height || 819}
            sizes="(max-width: 640px) 100vw, 640px"
            alt={name || "placeholder"}
          />
        </CardHeader>
      )}
      <CardBody className="flex-col items-start px-4 pb-0 pt-2">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {name}
        </h5>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </CardBody>
    </Card>
  );
};

export default MemberCard;

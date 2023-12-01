import HeaderWrap from "@/components/layout/wrap/header";
import { HeaderProps } from "@/types";

import LinkSwitcher from "../../shared/links";
import LogoImageComponent from "../image/logo";

type HeaderPageProps = {
  data?: HeaderProps;
};

export default function Header({ data }: HeaderPageProps) {
  const { title, links, _type, image } = data ?? {};
  return (
    <HeaderWrap>
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {image && (
          <div className="flex items-center justify-center">
            <LogoImageComponent data={image} />
          </div>
        )}
        {title && (
          <p className="text-center text-lg font-semibold sm:text-left lg:text-2xl">
            {title}
          </p>
        )}
        {links &&
          links.map((link: any) => (
            <LinkSwitcher
              key={link._key}
              data={link || link.reference}
              type={link._type}
            >
              {link.title}
            </LinkSwitcher>
          ))}
      </div>
    </HeaderWrap>
  );
}

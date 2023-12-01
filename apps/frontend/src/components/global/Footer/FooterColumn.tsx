import LinkSwitcher from "@/components/studio/shared/links";
import { FooterColumn as FooterColumnProps } from "@/types";

export function FooterColumn({
  data,
  type,
}: {
  data: FooterColumnProps;
  type: string;
}) {
  const { title, links } = data ?? {};

  return (
    <div className="">
      {/* Column Title */}
      {title && (
        <p className="text-sm font-semibold leading-6 text-gray-900">{title}</p>
      )}
      {/* Column Links */}
      <ul role="list" className="ml-0 mt-6 list-outside list-none space-y-4">
        {links &&
          links.map((link: any, i) => (
            <li key={i} className="list-outside list-none text-sm">
              <LinkSwitcher
                key={i}
                data={link}
                _type="footer"
                type={type}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

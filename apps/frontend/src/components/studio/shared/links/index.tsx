import ButtonLink from "@/components/studio/elements/buttons/button-link";
import UnderlineLink from "@/components/studio/elements/links/underline-link";
import UnstyledLink from "@/components/studio/elements/links/unstyled-link";

function AnnotationLinkInternal({ data, children, className, theme }: any) {
  const { slug } = data ?? {};
  return (
    <UnderlineLink href={`/${slug}`} className={`${className}`}>
      {children}
    </UnderlineLink>
  );
}
function AnnotationLinkEmail({ data, children, className, theme }: any) {
  const { email } = data ?? {};
  return (
    <UnstyledLink
      target="_blank"
      href={`mailto:${email}`}
      className={`${className}`}
    >
      {children}
    </UnstyledLink>
  );
}

function InternalLink({ data, className, theme, variant }: any) {
  const { reference, title } = data ?? {};
  return (
    <UnderlineLink href={`/${reference?.slug}`} className={`${className}`}>
      {title}
    </UnderlineLink>
  );
}

function ReferenceLink({ data, className, theme, variant }: any) {
  const { reference } = data ?? {};
  return (
    <UnderlineLink href={`/${reference?.slug}`} className={`${className}`}>
      {reference?.title}
    </UnderlineLink>
  );
}

function LinkAction({ data, className, theme, variant }: any) {
  const { text, type, modal } = data ?? {};

  return (
    <ButtonLink
      // add the modal.slug.current to the url so we can open the modal from useParams
      href={`?type=${type}&${modal.slug.current}`}
      target="_self"
      className={`${className}`}
      theme={theme}
      variant={variant ?? "primary"}
    >
      {text ?? "Link"}
    </ButtonLink>
  );
}

function ExternalLink({ data, className, theme }: any) {
  const link = data ?? {};

  if (link?.type === "button") {
    return (
      <ButtonLink
        href={link.url}
        target={link.newWindow ? "_blank" : "_self"}
        className={`${theme} ${className}`}
        variant={link.variant ?? "primary"}
      >
        {link.title}
      </ButtonLink>
    );
  }

  return (
    <UnderlineLink
      href={link.url}
      target={link.newWindow ? "_blank" : "_self"}
      className={`${theme} ${className}`}
    >
      {link.title}
    </UnderlineLink>
  );
}

export default function LinkSwitcher({ data, className, type, children }: any) {
  const { _type } = data ?? {};
  const pageType = type ?? "";

  let theme = "";
  switch (pageType) {
    case "header.page":
      theme = "page";
      break;
    case "header.home":
      theme = "home";
      break;
    case "section":
      theme = "section";
      break;
    default:
      theme = "none";
      break;
  }

  switch (_type) {
    case "linkInternal":
      return <InternalLink data={data} className={className} theme={theme} />;
    case "linkReference":
      return <ReferenceLink data={data} className={className} theme={theme} />;
    case "linkExternal":
      return <ExternalLink data={data} className={className} theme={theme} />;
    case "annotationLinkInternal" || "annotationLinkExternal":
      return (
        <AnnotationLinkInternal data={data} className={className} theme={theme}>
          {children}
        </AnnotationLinkInternal>
      );
    case "annotationLinkEmail":
      return (
        <AnnotationLinkEmail data={data} className={className} theme={theme}>
          {children}
        </AnnotationLinkEmail>
      );
    case "linkAction":
      return <LinkAction data={data} className={className} theme={theme} />;
    default:
      return null;
  }
}

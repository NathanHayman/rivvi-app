import type { PortableTextBlock } from "@portabletext/types";
import type { Image } from "sanity";

export type HomeMembersPayload = {
  _type?: string;
  active?: boolean;
  header?: string;
  subheader?: string;
  highlightedMembers?: MemberShort[];
  cta?: {
    title?: string;
  };
};

export type Redirect = {
  source?: string;
  destination?: string;
  permanent?: boolean;
};

export type RedirectsPayload = {
  redirects?: Redirect[];
};

interface AlertBarPayload {
  active?: boolean;
  text?: PortableTextBlock[] | null;
}
export type ContactPagePayload = {
  header?: string;
  subheader?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type AboutPagePayload = {
  title?: string;
  header?: string;
  subheader?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type AboutPayload = {
  sections?: SectionProps[];
};

export type AllPostsPayload = {
  posts?: ShortPost[];
};

export type ShortPost = {
  _id?: string;
  title?: string;
  excerpt?: PortableTextBlock[] | null;
  image?: Image;
  date?: string;
  author?: {
    name?: string;
  };
  category?: {
    title?: string;
  };
  slug?: string;
};

export type Post = {
  title?: string;
  excerpt?: string;
  image?: Image;
  date?: string;
  content?: PortableTextBlock[] | null;
  author?: {
    name?: string;
  };
  category?: {
    title?: string;
  };
  slug?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: any;
    canonical?: string;
  };
};

export type Form = {
  title?: string;
  type?: string;
  download?: string;
};
export type PatientCenterPagePayload = {
  header?: string;
  subheader?: string;
  forms?: Form[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};
export type ServicesPagePayload = {
  header?: string;
  subheader?: string;
  types?: ServiceType[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};
export type CareersPagePayload = {
  header?: string;
  subheader?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};
export type NewsPagePayload = {
  header?: string;
  subheader?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};
export type LocationsPagePayload = {
  header?: string;
  subheader?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};
export type MembersPagePayload = {
  header?: string;
  subheader?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type SocialMedia = {
  _type: string;
  href?: string;
};

export type Hero = {
  _type: string;
  buttonText1?: string;
  buttonText2?: string;
  buttonLink1?: string;
  buttonLink2?: string;
  description?: string;
  image?: Image;
  title?: string;
};

interface Color {
  _type?: "color";
  hex?: string;
  hsl?: {
    a?: number;
    h?: number;
    l?: number;
    s?: number;
  };
  hsv?: {
    a?: number;
    h?: number;
    s?: number;
    v?: number;
  };
  rgb?: {
    a?: number;
    b?: number;
    g?: number;
    r?: number;
  };
  alpha?: number;
}

export type ColorScheme = {
  primary?: Color;
  secondary?: Color;
  accent?: Color;
};

// Page payloads

export type ServiceType = {
  title?: string;
  subtitle?: string;
};

export type ServiceTypesPayload = {
  serviceTypes?: ServiceType[];
};

export type Service = {
  title?: string;
  slug?: string;
  subtitle?: string;
  content?: PortableTextBlock[];
  faqs?: Faq[];
  relatedServices?: ServiceShort[];

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type ServiceShort = {
  title?: string;
  slug?: string;
  subtitle?: string;
};

export type Member = {
  name?: string;
  slug?: string;
  image?: any;
  title?: string;
  specialties?: string[];
  languages?: string[];
  accepting?: boolean;
  bio: PortableTextBlock[];
  locations?: LocationShort[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type MemberShort = {
  name?: string;
  slug?: string;
  title?: string;
  accepting?: boolean;
  specialties?: string[];
  image?: any;
};

interface News {
  title?: string;
  slug?: string;
}

interface Hours {
  day?: string;
  hours?: string;
  isOpen?: boolean;
}

interface Contact {
  type?: string;
  value?: string;
}

export type Insurance = {
  name?: string;
  logo?: any;
};

interface Review {
  name?: string;
  date?: string;
  rating?: number;
  title?: string;
  description?: string;
}

interface Faq {
  question: string;
  answer: PortableTextBlock[];
}

interface ExtraInfo {
  parking?: string;
  publicTransportation?: string;
  additionalInfo?: string;
}

interface Address {
  fullAddress?: {
    street?: string;
    city?: string;
    state?: string;
    suite?: string;
    zip?: string;
  };
  geoLocation?: {
    lat?: number;
    lng?: number;
  };
}

export type Location = {
  name?: string;
  slug?: string;
  index?: number;
  overview?: PortableTextBlock[];
  image?: any;
  services?: Service[];
  members?: Member[];
  faqs?: Faq[];
  hours?: Hours[];
  contactInfo: Contact[];
  reviews: Review[];
  extraInfo: ExtraInfo[];
  address?: Address;
  lat?: number;
  lng?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type LocationShort = {
  _id?: string;
  name?: string;
  slug?: string;
  index?: number;
  image?: any;
  contactInfo?: Contact[];
  overview?: PortableTextBlock[];
  address?: Address;
};

export type LocationsPayload = {
  locations?: LocationShort[];
};

export type LocationPayload = {
  name?: string;
  slug?: string;
  index?: number;
  overview?: PortableTextBlock[];
  image?: any;
  services?: Service[];
  members?: MemberShort[];
  faqs?: Faq[];
  hours?: Hours[];
  contactInfo: Contact[];
  reviews: Review[];
  extraInfo: ExtraInfo[];
  address?: Address;
  lat?: number;
  lng?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type MembersPayload = {
  members?: MemberShort[];
};

export type MemberPayload = {
  name?: string;
  slug?: string;
  image?: any;
  title?: string;
  specialties?: string[];
  languages?: string[];
  accepting?: boolean;
  boardCertifications?: string[];
  proffesionalAffiliations?: string[];
  services?: ServiceShort[];
  insurances?: Insurance[];
  reviews?: Review[];
  bio: PortableTextBlock[];
  locations?: LocationShort[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type ServicesPayload = {
  services?: ServiceShort[];
};

export type ServicePayload = {
  title?: string;
  slug?: string;
  subtitle?: string;
  content: PortableTextBlock[];
  faqs?: Faq[];
  relatedServices?: ServiceShort[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type HeadingProps = {
  title?: string;
  subtitle?: string;
};

// -------------------- //
// --- SANITY TYPES --- //

// HEADER
export type HeaderProps = {
  _type?: "header.page" | "header.home";
  title?: string;
  links?: any;
  image?: any;
};

// THEME
export type ThemeProps = {
  _id?: string;
  title?: string;
  background?: {
    hex?: string;
  };
  text?: {
    hex?: string;
  };
  buttonBackground?: {
    hex?: string;
  };
  buttonText?: {
    hex?: string;
  };
  outlineButton?: {
    hex?: string;
  };
};

// PAGE
export type PageProps = {
  _id: string;
  pageType?: string;
  slug?: {
    current: string;
  };
  sections?: any;
  header?: any;
  footer?: any;
};

// HOME
export type HomeProps = {
  _id: string;
  slug?: {
    current: string;
  };
  sections?: any;
  header?: any;
  footer?: any;
};

// SECTION
export type SectionProps = {
  _id?: string;
  _key?: string;
  title?: string;
  subtitle?: string;
  modules?: any;
};
export type SectionTitleProps = {
  title?: string;
  subtitle?: string;
};

// MODULE

// MODULE: CALL TO ACTION
export type CallToActionProps = {
  _key?: string;
  _type?: "module.callToAction";
  layout?: string;
  title?: string;
  body?: string;
  links?: any;
  content?: {
    // array with max 1 image ref
    _type?: "image";
    asset?: any;
    alt?: string;
    caption?: string;
    hotspot?: any;
  };
};

// MODULE: CALL OUT
export type CalloutProps = {
  _key?: string;
  _type?: "module.callout";
  text?: string;
  links?: any;
};

// MODULE: ACCORDION
export type AccordionProps = {
  _key?: string;
  _type?: "module.accordion";
  groups?: AccordionGroupProps[];
};
export type AccordionGroupProps = {
  _key?: string;
  _type?: "accordionGroup";
  title?: string;
  body?: PortableTextBlock[];
};

// MODULE: CONTENT
export type ContentProps = {
  _key?: string;
  _type?: "module.contentImage" | "module.contentAll" | "module.contentPlain";
  contentAll?: ContentAllProps[];
  contentPlain?: ContentPlainProps[];
  contentImage?: ContentImageProps[];
};
export type ContentAllProps = {
  _key?: string;
  _type?: "module.contentAll";
  header?: ContentHeaderProps;
  contentAllBody?: PortableTextBlock[];
};
export type ContentImageProps = {
  _key?: string;
  _type?: "module.contentImage";
  header?: ContentHeaderProps;
  contentLayout?: "leftImage" | "rightImage";
  image?: Image;
  contentImageBody?: PortableTextBlock[];
};
export type ContentPlainProps = {
  _key?: string;
  _type?: "module.contentPlain";
  header?: ContentHeaderProps;
  contentPlainBody?: PortableTextBlock[];
};
export type ContentHeaderProps = {
  _key?: string;
  _type?: "header.content";
  title?: string;
  subtitle?: string;
};

export type SeoProps = {
  _type?: "seo.home" | "seo.page";
  title?: string;
  description?: string;
  image?: Image;
};

// MODULE: GRID
export type GridProps = {
  _key?: string;
  _type?: "module.grid";
  items?: GridItemProps[];
};
export type GridItemProps = {
  _key?: string;
  _type?: "gridItem";
  title?: string;
  subtitle?: string;
  image?: Image;
  body?: PortableTextBlock[];
  links?: any;
};

// MODULE: VIDEO
export type VideoProps = {
  _key?: string;
  _type?: "module.video";
  fullscreen?: boolean;
  autoplay?: boolean;
  video?: any;
  textBelowVideo?: any;
};

export type VideoPlayerProps = {
  video?: {
    desktopPlaybackId?: string;
    mobilePlaybackId?: string;
  };
  fullscreen?: boolean;
  autoplay?: boolean;
};

// IMAGE
export type ImageProps = {
  _type?: "image";
  asset?: any;
  alt?: string;
  caption?: string;
  hotspot?: any;
  crop?: any;
  width?: number;
  height?: number;
  size?: string;
  imageUrl?: string;
};

// IMAGE BOX
export type ImageBoxProps = {
  image?: {
    asset?: any;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
  crop?: any;
  alt?: string;
  width?: number;
  height?: number;
  size?: string;
  classesWrapper?: string;
};
// Page payloads

export type HomePagePayload = {
  _id: string;
  slug?: {
    current: string;
  };
  sections?: SectionProps[];
  header?: any;
  footer?: any;
};

export type PagePayload = {
  _id: string;
  body?: PortableTextBlock[];
  name?: string;
  overview?: PortableTextBlock[];
  title?: string;
  slug?: string;
};

export type ProjectPayload = {
  client?: string;
  coverImage?: Image;
  description?: PortableTextBlock[];
  duration?: {
    start?: string;
    end?: string;
  };
  overview?: PortableTextBlock[];
  site?: string;
  slug: string;
  tags?: string[];
  title?: string;
};

export type Link = {
  _type: "linkExternal";
  url: string;
  title: string;
  type: "button" | "link";
  newWindow?: boolean;
  slug?: string;
};

export type Reference = {
  _type?: "linkReference" | "reference" | "linkInternal";
  _key?: string;
  reference?: {
    slug?: string;
    title?: string;
  };
};

export type MenuItem = {
  _type?: "linkReference" | "linkExternal" | "linkInternal";
  _key?: string;
  reference?: {
    _id?: string;
    _type?: string;
    slug?: string;
    title?: string;
  };
  url?: string;
  title?: string;
  type?: "button" | "link";
  newWindow?: boolean;
};

export type TopMenuItem = {
  _type?: "linkReference" | "linkExternal" | "linkInternal";
  _key?: string;
  reference?: {
    slug?: string;
    title?: string;
  };
  url?: string;
  title?: string;
  type?: "button" | "link";
  newWindow?: boolean;
};

export type SwitchLink = {
  _type?: "linkReference" | "linkExternal" | "linkInternal";
  _key?: string;
  reference?: {
    slug?: string;
    title?: string;
  };
  url?: string;
  title?: string;
  type?: "button" | "link";
  newWindow?: boolean;
};

export type FooterColumn = {
  _type?: string;
  title?: string;
  links?: SwitchLink[];
};

// FOOTER COLUMN
export type FooterColumnProps = {
  _type?: "footerColumn";
  title?: string;
  links?: SwitchLink[];
};

export type FooterProps = {
  _key?: string;
  _type?: "footer";
  footerText?: PortableTextBlock[];
  footerMenuItems?: FooterColumnProps[];
  socialMedia?: SocialMedia[];
  logo?: any;
};

export type SettingsPayload = {
  footerText?: PortableTextBlock[];
  ogImage?: Image;
  footerMenuItems?: FooterColumn[];
  menuItems?: MenuItem[];
  topMenuItems?: TopMenuItem[];
  socialMedia?: SocialMedia[];
  logo?: any;
  colorScheme?: ColorScheme;
  alertBar?: AlertBarPayload;
};

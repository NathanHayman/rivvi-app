import { groq } from "next-sanity";

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    pageType,
    header -> {
      ...,
      links[] {
        ...,
        _type == "linkInternal" || _type == "linkReference" => {
          reference -> {
            ...,
            _type == "page" => {
              "slug": slug.current,
            },
          },
        },
      },
    },
    footer->{
      ...,
      columns[] {
        title,
              links[] {
        ...,
        _type == "linkInternal" => {
          reference -> {
          
            _type == "page" => {
              "slug": slug.current,
            },
          },
        },
        _type == "linkReference" => {
          reference -> {
            _type == "page" => {
              "slug": slug.current,
            },
          },
        },
      },
      
      }
    },
    sections[]{
      ...,
      _type == "section" => {
        title,
        subtitle,
        modules[]{
          ...,
          _type == "module.callToAction" => {
            ...,
            content[] {
              _type == "image" => {
                asset -> {
                  ...,
                  "url": url,
                },
              },   
            },
            links[] {
              ...,
              _type == "linkInternal" => {
                reference -> {
                  ...,
                  _type == "page" => {
                    "slug": slug.current,
                  },
                  _type == "home" => {
                    "slug": "/",
                  },
                },
              },
              _type == "linkReference" => {
                reference -> {
                  _type == "page" => {
                    "slug": slug.current,
                  },
                },
              },
              _type == "linkAction" => {
                ...,
                modal -> {
                  ...,
                  _type == "reference" => {
                    ...,
                    _type == "modal" => {
                      "slug": slug.current,
                    },
                  },
                },
              },
            },
          },
          _type == "module.video" => {
            video {
              "desktopPlaybackId": desktopVideo.asset->playbackId,
              "mobilePlaybackId": mobileVideo.asset->playbackId,
            },
            textBelowVideo[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                    "slug": @.reference->slug.current,
                },
              },
            },
          },
          _type == "module.grid" => {
            ...,
            items[] {
              ...,
              _type == "gridItem" => {
                ...,
                links[] {
                  ...,
                  _type == "linkInternal" => {
                    reference -> {
                      ...,
                      _type == "page" => {
                        "slug": slug.current,
                      },
                      _type == "home" => {
                        "slug": "/",
                      },
                    },
                  },
                  _type == "linkReference" => {
                    reference -> {
                      _type == "page" => {
                        "slug": slug.current,
                      },
                    },
                  },
                  _type == "linkAction" => {
                    ...,
                    modal -> {
                      ...,
                      _type == "reference" => {
                        ...,
                        _type == "modal" => {
                          "slug": slug.current,
                        },
                      },
                    },
                  },
                },
                body[] {
                  ...,
                  markDefs[]{
                    ...,
                    _type == "annotationLinkInternal" => {
                      reference -> {
                        "slug": @.reference->slug.current,
                      },
                    },
                  },
                },
              },
            },
          },
          _type == "module.contentImage" => {
            ...,
            contentImageBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentPlain" => {
            ...,
            contentPlainBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentAll" => {
            ...,
            contentAllBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
        },
      },
    },
    "pageTheme": theme -> {
      title,
      background,
      text,
      buttonBackground,
      buttonText,
      outlineButton,
    },
    title,
    "slug": slug.current,
    seo,
  }
`;

export const pagePathsWithSlugQuery = groq`
  *[_type == "page" && slug.current != null].slug.current
`;

// for non slug pages return the id and title and set the slug to NO SLUG
export const pagesWithoutSlugQuery = groq`
  *[_type == "page" && slug.current == null] {
    _id,
    title,
    "slug": "NO SLUG",
  }
`;

export const homePageQuery = groq`
  *[_type == "home"][0] {
    _id,
    header -> {
      ...,
      links[] {
        ...,
        _type == "linkInternal" => {
          reference -> {
            ...,
            _type == "page" => {
              "slug": slug.current,
            },
          },
        },
        _type == "linkInternal" || _type == "linkReference" => {
          reference -> {
            ...,
            _type == "page" => {
              "slug": slug.current,
            },
          },
        },
      },
    },
    footer -> {
      ...,
      links[] {
        ...,
        _type == "linkInternal" => {
          reference -> {
            ...,
            _type == "page" => {
              "slug": slug.current,
            },
          },
        },
      },
    },
    sections[]{
      ...,
      _type == "section" => {
        title,
        subtitle,
        modules[]{
          ...,
          _type == "module.callToAction" => {
            ...,
            content[] {
              _type == "image" => {
                asset -> {
                  ...,
                  "url": url,
                },
              },   
            },
            links[] {
              ...,
              _type == "linkInternal" => {
                reference -> {
                  ...,
                  _type == "page" => {
                    "slug": slug.current,
                  },
                  _type == "home" => {
                    "slug": "/",
                  },
                },
              },
            },
          },
          _type == "module.video" => {
            video {
              "desktopPlaybackId": desktopVideo.asset->playbackId,
              "mobilePlaybackId": mobileVideo.asset->playbackId,
            },
            textBelowVideo[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.grid" => {
            ...,
            items[] {
              ...,
              _type == "gridItem" => {
                ...,
                links[] {
                  ...,
                  _type == "linkInternal" => {
                    reference -> {
                      ...,
                      _type == "page" => {
                        "slug": slug.current,
                      },
                      _type == "home" => {
                        "slug": "/",
                      },
                    },
                  },
                },
                body[] {
                  ...,
                  markDefs[]{
                    ...,
                    _type == "annotationLinkInternal" => {
                      reference -> {
                        "slug": @.reference->slug.current,
                      },
                    },
                  },
                },
              },
            },
          },
          _type == "module.contentImage" => {
            ...,
            contentImageBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentPlain" => {
            ...,
            contentPlainBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentAll" => {
            ...,
            contentAllBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
        },
      },
    },
    "homeTheme": theme -> {
      title,
      background,
      text,
      buttonBackground,
      buttonText,
      outlineButton,
    },
    title,
    "slug": slug.current,
    seo,
  }
`;

export const homeSeoQuery = groq`
  *[_type == "home"][0] {
    seo,
  }
`;

export const pageSeoQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    seo,
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
  }
`;

// export const settingsQuery = groq`
//   *[_type == "settings"][0]{
//     footer,
//     menuItems[]->{
//       _type,
//       "slug": slug.current,
//       title
//     },
//     ogImage,
//   }
// `

export const getAllPosts = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const getAllMembers = groq`
  *[_type == "member" && defined(slug.current)].slug.current
`;

export const getAllLocations = groq`
  *[_type == "location" && defined(slug.current)].slug.current
`;

export const getAllServices = groq`
  *[_type == "service" && defined(slug.current)].slug.current
`;

export const getAllPages = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`;

export const homePageTitleQuery = groq`
  *[_type == "home"][0].title
`;

export const projectPaths = groq`
  *[_type == "project" && slug.current != null].slug.current
`;

export const pagePaths = groq`
  *[_type == "page" && slug.current != null].slug.current
`;

export const allRedirectsQuery = groq`
  *[_type == "settings"][0]{
    redirects[]{
      "source": from,
      "destination": to,
      permanent,
    }
  }
`;

export const alertBarQuery = groq`
  *[_type == "settings"][0]{
    alertBar,
  }`;

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    ogImage,
    footerText,
    footerMenuItems[]{
      ...,
      title,
      links[]{
        ...,
        _type == "linkReference" => {
          reference -> {
            "slug": slug.current,
            "title": title,
          },
        },
      }
    },
    menuItems[]{
      ...,
      _type == "linkReference" => {
        reference -> {
          ...,
          "slug": slug.current,
        },
      },
    },
    colorScheme,
    topMenuItems[] {
      ...,
      _type == "linkReference" => {
        reference -> {
          "slug": slug.current,
          "title": title,
        },
      },
    },
    socialMedia[]{
      ...,
      _type,
      href
    },
    logo,
    alertBar,
  }
`;

/* -------------------------------------------------------------------------- */

// Get All Locations
export const locationsQuery = groq`
  *[_type == "location" && defined(slug.current)]{
    _id,
    "slug": slug.current,
    name,
    address,
    contactInfo,
    overview,
  }
`;

// Get A Single Location By Its Slug
export const locationQuery = groq`
*[_type == "location" && slug.current == $slug][0] {
  _id,
  "slug": slug.current,
  name,
  seo,
  overview,
  address,
  contactInfo,
  reviews,
  faqs,
  "members": members[]->{
    _id,
    "slug": slug.current,
    name,
    image,
    role,
  },
  "services": services[]->{
    _id,
    "slug": slug.current,
    title,
    subtitle,
  },
  image,
  hours,
}
`;

// Get All Locations By Their Slugs
export const locationPathsQuery = groq`
  *[_type == "location" && slug.current != null].slug.current 
`;

// Get All Providers AND SORT BY A-Z NAME
export const membersQuery = groq`
  *[_type == "member" && defined(slug.current)] | order(name asc){
    _id,
    "slug": slug.current,
    name,
    image,
    title,
    specialty,
    languages,
    accepting,
    bio,
  }
`;

// Get A Single Provider By Its Slug
export const memberQuery = groq`
  *[_type == "member" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    name,
    image,
    title,
    specialties,
    boardCertifications,
    "affiliations": proffesionalAffiliations,
    education,
    reviews,
    "services": services[]->{
      _id,
      "slug": slug.current,
      title,
      subtitle,
    },
    "insurances": insurances[]->{
      _id,
      name,
      logo,
    },
    "locations": affiliatedLocations[]->{
      _id,
      "slug": slug.current,
      name,
      address,
      image,
    },
    languages,
    accepting,
    bio,
    seo,
  }
`;

// Get All Providers By Their Slugs
export const membersPathQuery = groq`
  *[_type == "member" && slug.current != null].slug.current 
`;

// Get All Services AND SORT BY A-Z TITLE
export const servicesQuery = groq`
  *[_type == "service" && defined(slug.current)] | order(title asc){
    _id,
    "slug": slug.current,
    title,
    subtitle,
  }
`;

export const serviceFields = `
    _id,
    "slug": slug.current,
    title,
    subtitle,
    content,
    faqs,
    relatedServices[]->{
      _id,
      "slug": slug.current,
      title,
      subtitle,
    },
    type,
    seo,
`;

export const memberFields = `
    _id,
    "slug": slug.current,
    name,
    image,
    title,
    specialties,
    boardCertifications,
    "affiliations": proffesionalAffiliations,
    education,
    reviews,
    "services": services[]->{
      _id,
      "slug": slug.current,
      title,
      subtitle,
    },
    "insurances": insurances[]->{
      _id,
      name,
      logo,
    },
    "locations": affiliatedLocations[]->{
      _id,
      "slug": slug.current,
      name,
      address,
      image,
    },
    languages,
    accepting,
    bio,
    seo,
`;

// Get A Single Service By Its Slug
export const serviceQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    title,
    subtitle,
    content,
    faqs,
    relatedServices[]->{
      _id,
      "slug": slug.current,
      title,
      subtitle,
    },
    type,
    seo,
  }
`;

// Get All Services By Their Slugs
export const servicePathsQuery = groq`
  *[_type == "service" && slug.current != null].slug.current 
`;

export const contactPageQuery = groq`
*[_type == "contact"][0]{
  _id,
  title,
  header,
  subheader,
  seo,
}
`;
export const contactQuery = groq`
  *[_type == "contact"][0]{
    _id,
    sections[]{
      ...,
      _type == "section" => {
        title,
        subtitle,
        modules[]{
          ...,
          _type == "module.callToAction" => {
            ...,
            content[] {
              _type == "image" => {
                asset -> {
                  ...,
                  "url": url,
                },
              },   
            },
            links[] {
              ...,
              _type == "linkInternal" => {
                reference -> {
                  ...,
                  _type == "page" => {
                    "slug": slug.current,
                  },
                  _type == "home" => {
                    "slug": "/",
                  },
                },
              },
              _type == "linkReference" => {
                reference -> {
                  _type == "page" => {
                    "slug": slug.current,
                  },
                },
              },
              _type == "linkAction" => {
                ...,
                modal -> {
                  ...,
                  _type == "reference" => {
                    ...,
                    _type == "modal" => {
                      "slug": slug.current,
                    },
                  },
                },
              },
            },
          },
          _type == "module.video" => {
            video {
              "desktopPlaybackId": desktopVideo.asset->playbackId,
              "mobilePlaybackId": mobileVideo.asset->playbackId,
            },
            textBelowVideo[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                    "slug": @.reference->slug.current,
                },
              },
            },
          },
          _type == "module.grid" => {
            ...,
            items[] {
              ...,
              _type == "gridItem" => {
                ...,
                links[] {
                  ...,
                  _type == "linkInternal" => {
                    reference -> {
                      ...,
                      _type == "page" => {
                        "slug": slug.current,
                      },
                      _type == "home" => {
                        "slug": "/",
                      },
                    },
                  },
                  _type == "linkReference" => {
                    reference -> {
                      _type == "page" => {
                        "slug": slug.current,
                      },
                    },
                  },
                  _type == "linkAction" => {
                    ...,
                    modal -> {
                      ...,
                      _type == "reference" => {
                        ...,
                        _type == "modal" => {
                          "slug": slug.current,
                        },
                      },
                    },
                  },
                },
                body[] {
                  ...,
                  markDefs[]{
                    ...,
                    _type == "annotationLinkInternal" => {
                      reference -> {
                        "slug": @.reference->slug.current,
                      },
                    },
                  },
                },
              },
            },
          },
          _type == "module.contentImage" => {
            ...,
            contentImageBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentPlain" => {
            ...,
            contentPlainBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentAll" => {
            ...,
            contentAllBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
        },
      },
    },
  }
`;

export const aboutPageQuery = groq`
  *[_type == "about"][0]{
    _id,
    title,
    header,
    subheader,
    seo,
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0]{
    _id,
    sections[]{
      ...,
      _type == "section" => {
        title,
        subtitle,
        modules[]{
          ...,
          _type == "module.callToAction" => {
            ...,
            content[] {
              _type == "image" => {
                asset -> {
                  ...,
                  "url": url,
                },
              },   
            },
            links[] {
              ...,
              _type == "linkInternal" => {
                reference -> {
                  ...,
                  _type == "page" => {
                    "slug": slug.current,
                  },
                  _type == "home" => {
                    "slug": "/",
                  },
                },
              },
              _type == "linkReference" => {
                reference -> {
                  _type == "page" => {
                    "slug": slug.current,
                  },
                },
              },
              _type == "linkAction" => {
                ...,
                modal -> {
                  ...,
                  _type == "reference" => {
                    ...,
                    _type == "modal" => {
                      "slug": slug.current,
                    },
                  },
                },
              },
            },
          },
          _type == "module.video" => {
            video {
              "desktopPlaybackId": desktopVideo.asset->playbackId,
              "mobilePlaybackId": mobileVideo.asset->playbackId,
            },
            textBelowVideo[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                    "slug": @.reference->slug.current,
                },
              },
            },
          },
          _type == "module.grid" => {
            ...,
            items[] {
              ...,
              _type == "gridItem" => {
                ...,
                links[] {
                  ...,
                  _type == "linkInternal" => {
                    reference -> {
                      ...,
                      _type == "page" => {
                        "slug": slug.current,
                      },
                      _type == "home" => {
                        "slug": "/",
                      },
                    },
                  },
                  _type == "linkReference" => {
                    reference -> {
                      _type == "page" => {
                        "slug": slug.current,
                      },
                    },
                  },
                  _type == "linkAction" => {
                    ...,
                    modal -> {
                      ...,
                      _type == "reference" => {
                        ...,
                        _type == "modal" => {
                          "slug": slug.current,
                        },
                      },
                    },
                  },
                },
                body[] {
                  ...,
                  markDefs[]{
                    ...,
                    _type == "annotationLinkInternal" => {
                      reference -> {
                        "slug": @.reference->slug.current,
                      },
                    },
                  },
                },
              },
            },
          },
          _type == "module.contentImage" => {
            ...,
            contentImageBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentPlain" => {
            ...,
            contentPlainBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentAll" => {
            ...,
            contentAllBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
        },
      },
    },
  }
`;
export const membersPageQuery = groq`
  *[_type == "members"][0]{
    _id,
    header,
    subheader,
    seo,
  }
`;
export const locationsPaqeQuery = groq`
  *[_type == "locations"][0]{
    _id,
    header,
    subheader,
    seo,
  }
`;

export const newsPageQuery = groq`
  *[_type == "news"][0]{
    _id,
    header,
    subheader,
    seo,
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"]{
    _id,
    "slug": slug.current,
    title,
    excerpt,
    "image": coverImage.asset->url,
    "author": author -> name,
    "category": category -> title,
    date,
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    title,
    excerpt,
    "image": coverImage.asset->url,
    "author": author -> name,
    "category": category -> title,
    date,
    content,
    seo,
  }
`;

export const postPathsQuery = groq`
  *[_type == "post" && slug.current != null].slug.current 
`;

export const patientCenterPageQuery = groq`
  *[_type == "patientCenter"][0]{
    _id,
    title,
    header,
    subheader,
    seo,
  }
`;

export const patientCenterQuery = groq`
  *[_type == "patientCenter"][0]{
    _id,
    sections[]{
      ...,
      _type == "section" => {
        title,
        subtitle,
        modules[]{
          ...,
          _type == "module.callToAction" => {
            ...,
            content[] {
              _type == "image" => {
                asset -> {
                  ...,
                  "url": url,
                },
              },   
            },
            links[] {
              ...,
              _type == "linkInternal" => {
                reference -> {
                  ...,
                  _type == "page" => {
                    "slug": slug.current,
                  },
                  _type == "home" => {
                    "slug": "/",
                  },
                },
              },
              _type == "linkReference" => {
                reference -> {
                  _type == "page" => {
                    "slug": slug.current,
                  },
                },
              },
              _type == "linkAction" => {
                ...,
                modal -> {
                  ...,
                  _type == "reference" => {
                    ...,
                    _type == "modal" => {
                      "slug": slug.current,
                    },
                  },
                },
              },
            },
          },
          _type == "module.video" => {
            video {
              "desktopPlaybackId": desktopVideo.asset->playbackId,
              "mobilePlaybackId": mobileVideo.asset->playbackId,
            },
            textBelowVideo[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                    "slug": @.reference->slug.current,
                },
              },
            },
          },
          _type == "module.grid" => {
            ...,
            items[] {
              ...,
              _type == "gridItem" => {
                ...,
                links[] {
                  ...,
                  _type == "linkInternal" => {
                    reference -> {
                      ...,
                      _type == "page" => {
                        "slug": slug.current,
                      },
                      _type == "home" => {
                        "slug": "/",
                      },
                    },
                  },
                  _type == "linkReference" => {
                    reference -> {
                      _type == "page" => {
                        "slug": slug.current,
                      },
                    },
                  },
                  _type == "linkAction" => {
                    ...,
                    modal -> {
                      ...,
                      _type == "reference" => {
                        ...,
                        _type == "modal" => {
                          "slug": slug.current,
                        },
                      },
                    },
                  },
                },
                body[] {
                  ...,
                  markDefs[]{
                    ...,
                    _type == "annotationLinkInternal" => {
                      reference -> {
                        "slug": @.reference->slug.current,
                      },
                    },
                  },
                },
              },
            },
          },
          _type == "module.contentImage" => {
            ...,
            contentImageBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentPlain" => {
            ...,
            contentPlainBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentAll" => {
            ...,
            contentAllBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
        },
      },
    },
    forms[]{
      type,
      title,
      "download": form.asset->url,
    },
  }
`;

export const careersPageQuery = groq`
  *[_type == "careers"][0]{
    _id,
    title,
    header,
    subheader,
    seo,
  }
`;

export const careersQuery = groq`
  *[_type == "careers"][0]{
    _id,
    sections[]{
      ...,
      _type == "section" => {
        title,
        subtitle,
        modules[]{
          ...,
          _type == "module.callToAction" => {
            ...,
            content[] {
              _type == "image" => {
                asset -> {
                  ...,
                  "url": url,
                },
              },   
            },
            links[] {
              ...,
              _type == "linkInternal" => {
                reference -> {
                  ...,
                  _type == "page" => {
                    "slug": slug.current,
                  },
                  _type == "home" => {
                    "slug": "/",
                  },
                },
              },
              _type == "linkReference" => {
                reference -> {
                  _type == "page" => {
                    "slug": slug.current,
                  },
                },
              },
              _type == "linkAction" => {
                ...,
                modal -> {
                  ...,
                  _type == "reference" => {
                    ...,
                    _type == "modal" => {
                      "slug": slug.current,
                    },
                  },
                },
              },
            },
          },
          _type == "module.video" => {
            video {
              "desktopPlaybackId": desktopVideo.asset->playbackId,
              "mobilePlaybackId": mobileVideo.asset->playbackId,
            },
            textBelowVideo[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                    "slug": @.reference->slug.current,
                },
              },
            },
          },
          _type == "module.grid" => {
            ...,
            items[] {
              ...,
              _type == "gridItem" => {
                ...,
                links[] {
                  ...,
                  _type == "linkInternal" => {
                    reference -> {
                      ...,
                      _type == "page" => {
                        "slug": slug.current,
                      },
                      _type == "home" => {
                        "slug": "/",
                      },
                    },
                  },
                  _type == "linkReference" => {
                    reference -> {
                      _type == "page" => {
                        "slug": slug.current,
                      },
                    },
                  },
                  _type == "linkAction" => {
                    ...,
                    modal -> {
                      ...,
                      _type == "reference" => {
                        ...,
                        _type == "modal" => {
                          "slug": slug.current,
                        },
                      },
                    },
                  },
                },
                body[] {
                  ...,
                  markDefs[]{
                    ...,
                    _type == "annotationLinkInternal" => {
                      reference -> {
                        "slug": @.reference->slug.current,
                      },
                    },
                  },
                },
              },
            },
          },
          _type == "module.contentImage" => {
            ...,
            contentImageBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentPlain" => {
            ...,
            contentPlainBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
          _type == "module.contentAll" => {
            ...,
            contentAllBody[] {
              ...,
              markDefs[]{
                ...,
                _type == "annotationLinkInternal" => {
                  reference -> {
                    "slug": @.reference->slug.current,
                  },
                },
              },
            },
          },
        },
      },
    },
  }
`;

export const servicesPageQuery = groq`
  *[_type == "services"][0]{
    _id,
    header,
    subheader,
    seo,
  }
`;

// get all service types
export const serviceTypesQuery = groq`
  *[_type == "serviceType"]{
    _id,
    title,
    subtitle,
  }
`;

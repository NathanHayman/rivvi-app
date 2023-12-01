import { groq } from "next-sanity";

export const pageDocIdBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
  }
`;

export const getAllPageDocIdsQuery = groq`
  *[_type == "page"] {
    _id,
    title,
    "slug": slug.current,
  }
`;

export const homeDocIdQuery = groq`
  *[_type == "home"][0] {
    _id,
  }
`;

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = [
  "settings",
  "home",
  "media.tag",
  "about",
  "contact",
  "careers",
  "patientCenter",
  "news",
  "locations",
  "members",
  "services",
];

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  { type: "page", title: "Page" },
  { type: "home", title: "Home" },
  { type: "about", title: "About" },
  { type: "contact", title: "Contact" },
  { type: "careers", title: "Careers" },
  { type: "patientCenter", title: "Patient Center" },
  { type: "locations", title: "Locations" },
  { type: "members", title: "Members" },
  { type: "services", title: "Services" },
  { type: "news", title: "News" },
];

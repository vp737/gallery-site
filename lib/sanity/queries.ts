const CONTACT_LINK_FIELDS = /* GraphQL */ `
  linkType
  email
  url
`

export const PAGE_QUERY = /* GraphQL */ `
  query Page {
    hero: Hero(id: "hero") {
      headline
      subheadline
      backgroundImage {
        publicId
      }
      buttonText
      buttonLink
    }
    gallery: Gallery(id: "gallery") {
      title
      items {
        _id
        title
        description
        size
        alt
        image {
          publicId
        }
        contactLink {
          ${CONTACT_LINK_FIELDS}
        }
      }
    }
    siteSettings: SiteSettings(id: "siteSettings") {
      siteTitle
      defaultContactLink {
        ${CONTACT_LINK_FIELDS}
      }
    }
  }
`

// Hand-written types for PAGE_QUERY. Sanity GraphQL returns null for any
// field that hasn't been filled in, and for documents that don't exist yet.

export type LinkType = 'email' | 'url'

export type ContactLink = {
  linkType: LinkType | null
  email: string | null
  url: string | null
}

export type CloudinaryImage = {
  publicId: string | null
}

export type Hero = {
  headline: string | null
  subheadline: string | null
  backgroundImage: CloudinaryImage | null
  buttonText: string | null
  buttonLink: string | null
}

// A gallery item as returned by PAGE_QUERY
export type GalleryItemQueryResult = {
  _id: string
  title: string | null
  description: string | null
  size: string | null
  alt: string | null
  image: CloudinaryImage | null
  contactLink: ContactLink | null
}

// Natural image size in pixels, added from Cloudinary in getPageData()
export type GalleryItem = GalleryItemQueryResult & {
  width: number
  height: number
}

export type Gallery<Item = GalleryItem> = {
  title: string | null
  // References to deleted or unpublished items resolve to null
  items: (Item | null)[] | null
}

export type SiteSettings = {
  siteTitle: string | null
  defaultContactLink: ContactLink | null
}

export type PageData = {
  hero: Hero | null
  gallery: Gallery | null
  siteSettings: SiteSettings | null
}

export type PageQueryResult = Omit<PageData, 'gallery'> & {
  gallery: Gallery<GalleryItemQueryResult> | null
}

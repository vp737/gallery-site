import type {Metadata} from 'next'

import Gallery from '@/components/gallery/Gallery'
import Hero from '@/components/Hero'
import {cloudinaryUrl} from '@/lib/cloudinary/url'
import {getPageData} from '@/lib/sanity/getPageData'
import type {GalleryItem} from '@/lib/sanity/types'

const DESCRIPTION_MAX = 160
const OG_IMAGE = {width: 1200, height: 630}

export async function generateMetadata(): Promise<Metadata> {
  const {hero, siteSettings} = await getPageData()

  const title = siteSettings?.siteTitle ?? undefined
  const description = hero?.subheadline ? truncate(hero.subheadline, DESCRIPTION_MAX) : undefined
  const publicId = hero?.backgroundImage?.publicId
  const images = publicId
    ? [
        {
          url: cloudinaryUrl(publicId, OG_IMAGE.width, {height: OG_IMAGE.height, crop: 'c_fill,g_auto'}),
          ...OG_IMAGE,
          alt: hero?.headline ?? title ?? '',
        },
      ]
    : undefined

  return {
    title,
    description,
    openGraph: {type: 'website', title, description, siteName: title, images},
    twitter: {card: images ? 'summary_large_image' : 'summary', title, description, images},
  }
}

// Cuts at a word boundary so the description doesn't end mid-word
function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, '')}…`
}

export default async function Home() {
  const {gallery, siteSettings} = await getPageData()
  // Drop references to deleted or unpublished items
  const items = (gallery?.items ?? []).filter((item): item is GalleryItem => item !== null)

  return (
    <main>
      <Hero />
      <section id="gallery">
        <Gallery
          title={gallery?.title ?? null}
          items={items}
          defaultContactLink={siteSettings?.defaultContactLink ?? null}
        />
      </section>
    </main>
  )
}

import {cacheTag} from 'next/cache'

import {FALLBACK_DIMENSIONS, getImageDimensions} from '@/lib/cloudinary/dimensions'

import {sanityGraphql} from './graphql'
import {PAGE_QUERY} from './queries'
import type {PageData, PageQueryResult} from './types'

export async function getPageData(): Promise<PageData> {
  'use cache'
  cacheTag('sanity')

  const {gallery, ...rest} = await sanityGraphql<PageQueryResult>(PAGE_QUERY)
  if (!gallery) return {...rest, gallery: null}

  const publicIds = (gallery.items ?? []).flatMap((item) => item?.image?.publicId ?? [])
  const dimensions = await getImageDimensions(publicIds)

  return {
    ...rest,
    gallery: {
      ...gallery,
      items:
        gallery.items?.map((item) => {
          if (!item) return null
          const publicId = item.image?.publicId
          return {...item, ...((publicId && dimensions.get(publicId)) || FALLBACK_DIMENSIONS)}
        }) ?? null,
    },
  }
}

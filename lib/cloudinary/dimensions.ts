import 'server-only'

import {CLOUDINARY_UPLOAD_BASE} from './url'

export type ImageDimensions = {width: number; height: number}

// Used when Cloudinary can't tell us the size, so the page still renders (4:5 portrait)
export const FALLBACK_DIMENSIONS: ImageDimensions = {width: 1600, height: 2000}

type GetInfoResponse = {input?: {width?: number; height?: number}}

// Looks up the natural size of each image in parallel. Failures fall back to
// FALLBACK_DIMENSIONS and are reported in a single warning.
export async function getImageDimensions(
  publicIds: string[],
): Promise<Map<string, ImageDimensions>> {
  const unique = [...new Set(publicIds)]
  const failed: string[] = []

  const entries = await Promise.all(
    unique.map(async (publicId): Promise<[string, ImageDimensions]> => {
      try {
        const res = await fetch(`${CLOUDINARY_UPLOAD_BASE}/fl_getinfo/${publicId}`, {
          signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const {input} = (await res.json()) as GetInfoResponse
        if (!input?.width || !input?.height) throw new Error('Missing width/height')

        return [publicId, {width: input.width, height: input.height}]
      } catch (error) {
        failed.push(`${publicId} (${error instanceof Error ? error.message : String(error)})`)
        return [publicId, FALLBACK_DIMENSIONS]
      }
    }),
  )

  if (failed.length > 0) {
    console.warn(
      `Could not get Cloudinary image dimensions, using ${FALLBACK_DIMENSIONS.width}×${FALLBACK_DIMENSIONS.height} for: ${failed.join(', ')}`,
    )
  }

  return new Map(entries)
}

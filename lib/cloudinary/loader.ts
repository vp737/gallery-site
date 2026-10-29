'use client'

import type {ImageLoaderProps} from 'next/image'

import {CLOUDINARY_UPLOAD_BASE} from './url'

// Registered globally in next.config, so every next/image src is a Cloudinary publicId
export default function cloudinaryLoader({src, width, quality}: ImageLoaderProps) {
  return `${CLOUDINARY_UPLOAD_BASE}/f_auto,q_${quality || 'auto'},w_${width},c_limit/${src}`
}

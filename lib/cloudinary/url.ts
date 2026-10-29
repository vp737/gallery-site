export const CLOUDINARY_UPLOAD_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

type CloudinaryUrlOptions = {
  height?: number
  // Cloudinary crop transformation, e.g. 'c_fill,g_auto'
  crop?: string
}

// For places next/image can't be used (CSS backgrounds, Open Graph images, etc.)
export function cloudinaryUrl(
  publicId: string,
  width: number,
  {height, crop = 'c_limit'}: CloudinaryUrlOptions = {},
) {
  const size = height ? `w_${width},h_${height}` : `w_${width}`
  return `${CLOUDINARY_UPLOAD_BASE}/f_auto,q_auto,${size},${crop}/${publicId}`
}

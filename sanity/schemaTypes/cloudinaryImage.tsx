import {defineField, defineType, type ObjectInputProps} from 'sanity'

export function cloudinaryThumbnailUrl(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_300,f_auto,q_auto/${publicId}`
}

function CloudinaryImageInput(props: ObjectInputProps<{publicId?: string}>) {
  const publicId = props.value?.publicId?.trim()

  return (
    <div style={{display: 'grid', gap: 12}}>
      {props.renderDefault(props)}
      {publicId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cloudinaryThumbnailUrl(publicId)}
          alt=""
          style={{display: 'block', maxWidth: 150, height: 'auto', borderRadius: 3}}
        />
      )}
    </div>
  )
}

export const cloudinaryImage = defineType({
  name: 'cloudinaryImage',
  title: 'Cloudinary image',
  type: 'object',
  fields: [
    defineField({
      name: 'publicId',
      title: 'Public ID',
      type: 'string',
      description: 'Copy the Public ID from the Cloudinary Media Library, e.g. gallery/sunset-01',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          if (value.toLowerCase().startsWith('http')) {
            return 'Use the Public ID, not the full URL'
          }
          if (/\s/.test(value)) return 'Public ID cannot contain spaces'
          return true
        }),
    }),
  ],
  components: {input: CloudinaryImageInput},
})
